require('dotenv').config();
const { google } = require('googleapis');
const { Configuration, OpenAIApi } = require('openai')
const bluePrint = require('./instructions')
// const Bottleneck = require('bottleneck');
const User = require('../models/userSchema');
const { addEmailtoQdrant } = require('./embedding-functions')

// const gmailLimiter = new Bottleneck({
//   reservoir: 35, // Number of requests allowed per interval
//   reservoirRefreshAmount: 35, // Number of requests to replenish the reservoir every interval
//   reservoirRefreshInterval: 1000, // Interval in milliseconds to replenish the reservoir
//   maxConcurrent: 1, // Number of concurrent requests allowed
// });

const validateAccess = async (oAuth2Client, user) => {
  if (oAuth2Client.isTokenExpiring()) {
    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken
    });
    user.accessToken = oAuth2Client.getAccessToken();
  }
}

const getGmailApiClient = async (oAuth2Client, user) => {
  await validateAccess(oAuth2Client, user);
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
    return gmail
  } catch (error) {
    console.error("Error occured while getting Gmail API Client: " + error)
  }
}

const getOnboardingMail = (gmail, filter) => {
  return new Promise((resolve, reject) => {
    const emails = [];
    gmail.users.messages.list(
      {
        userId: 'me',
        labelIds: ['INBOX'],
        maxResults: 250,
        q: filter,
        orderBy: 'internalDate desc',
        includeSpamTrash: false,
      },
      (err, response) => {
        if (err) {
          console.error('Error retrieving latest email:', err);
          reject(err);
          return;
        }

        const retrievedEmails = response.data.messages;
        const promises = [];

        for (let email of retrievedEmails) {
          const emailId = email.id;

          const promise = new Promise((resolve, reject) => {
            gmail.users.messages.get(
              {
                userId: 'me',
                id: emailId,
                format: 'full',
              },
              async (err, response) => {
                if (err) {
                  console.error('Error retrieving email:', err);
                  reject(err);
                  return;
                }

                const rawEmailData = response.data;
                const headers = rawEmailData.payload.headers;

                const senderHeader = headers.find((header) => header.name === 'From');
                const sender = senderHeader ? senderHeader.value : 'No Sender';

                const subjectHeader = headers.find((header) => header.name === 'Subject');
                const subject = subjectHeader ? subjectHeader.value : 'No Subject';

                const body = rawEmailData.snippet ? rawEmailData.snippet : 'No Body';

                const gmailId = rawEmailData.id ? rawEmailData.id : 'No Gmail ID';


                const sentDate = new Date(parseInt(rawEmailData.internalDate));

                const email = { sender, subject, body, sentDate, gmailId };
                resolve(email);
              }
            );
          });

          promises.push(promise);
        }

        Promise.all(promises)
          .then((emails) => {
            resolve(emails);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  });
};

const newToOldMailSort = async (emails) => {
  // latest -> oldest
  const newMail = await Promise.all(
    emails.map(async (email) => {
      return {
        ...email,
        sentDate: new Date(email.sentDate)
      }
    })
  )

  newMail.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
  return newMail
}

const loadMailToDB = async (gmail, filter, userId, emailAddress, pageToken = null) => {
  const emails = [];
  let batchesLoaded = 0 // 750 emails will be loaded in 3 batches (3 x 250 emails)

  const retrieveAndProcessEmail = async (emailId) => {
    return new Promise((resolve, reject) => {
      gmail.users.messages.get(
        {
          userId: 'me',
          id: emailId,
          format: 'full',
        },
        async (err, response) => {
          if (err) {
            console.error('Error retrieving email:', err);
            reject(err);
            return;
          }

          const rawEmailData = response.data;
          const headers = rawEmailData.payload.headers;

          const senderHeader = headers.find((header) => header.name === 'From');
          const sender = senderHeader ? senderHeader.value : 'No Sender';

          const subjectHeader = headers.find((header) => header.name === 'Subject');
          const subject = subjectHeader ? subjectHeader.value : 'No Subject';

          const body = rawEmailData.snippet ? rawEmailData.snippet : 'No Body';

          const gmailId = rawEmailData.id ? rawEmailData.id : 'No Gmail ID';

          const unixTimestamp = rawEmailData.internalDate
          const sentDate = new Date(parseInt(unixTimestamp));

          const email = { sender, subject, body, sentDate, gmailId };
          // User.findByIdAndUpdate(userId, { $push: { emails: email } })
          //   .then(() => {
          await Promise.all([
            addEmailtoQdrant(emailAddress, sender, subject, body, gmailId, unixTimestamp),
            User.findByIdAndUpdate(userId, { $push: { emails: email } }).exec(),
          ]);
          resolve(email);
          // })
        }
      );
    });
  };

  return new Promise(async (resolve, reject) => {
    const processNextPage = async (pageToken) => {
      console.log(pageToken)
      try {
        gmail.users.messages.list(
          {
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 250, // Fetch 250 emails per request
            q: filter,
            orderBy: 'internalDate desc',
            includeSpamTrash: false,
            pageToken: pageToken,
          },
          async (err, response) => {
            if (err) {
              console.error('Error retrieving latest email: ', err);
              reject(err);
              return;
            }

            const nextPageToken = response.data.nextPageToken;
            const retrievedEmails = response.data.messages;

            await Promise.all(retrievedEmails.map((email) => retrieveAndProcessEmail(email.id)))
              .then(() => {
                batchesLoaded++
                emails.push(...retrievedEmails)
                if (nextPageToken && batchesLoaded < 3) {
                  console.log(`loaded: ${emails.length}`);
                  processNextPage(nextPageToken)
                } else {
                  console.log(`Finished fetching and adding remaining 750 emails for user with ID: ${userId}`);
                  resolve()
                  return
                }
              })

            // // Push individual email objects to the emails array
            // retrievedEmails.forEach((email) => {
            //   emails.push(email);
            // });


          }
        )
      }
      catch (error) {
        console.error('Error while fetching 250 Emails: ' + error)
        reject(error)
        return
      }
    };

    processNextPage(pageToken) // Start fetching emails
  });
};




module.exports = {
  getGmailApiClient,
  loadMailToDB,
  getOnboardingMail,
  newToOldMailSort,
}

