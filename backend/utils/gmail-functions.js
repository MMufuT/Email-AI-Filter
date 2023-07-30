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

const validateAccess = (oAuth2Client, user) => {
  if (oAuth2Client.isTokenExpiring()) {
    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken
    });
    user.accessToken = oAuth2Client.getAccessToken();
  }
}

const getGmailApiClient = (oAuth2Client, user) => {
  validateAccess(oAuth2Client, user);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
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
              (err, response) => {
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

const getPostOnboardingMail = (gmailApi, beforeDate) => {
  console.log('entered')
  return new Promise((resolve, reject) => {
    const emails = [];
    const maxResultsPerRequest = 500;
    let nextPageToken = null;

    const listMessages = () => {
      if (emails.length >= 4500) {
        resolve(emails.slice(0, 4500)); // Return only the first 4500 emails
        return;
      }

      gmailLimiter.schedule(() => {
        return gmailApi.users.messages.list(
          {
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: maxResultsPerRequest,
            q: `in:inbox before:${beforeDate.toISOString()}`,
            orderBy: 'internalDate desc',
            includeSpamTrash: false,
            pageToken: nextPageToken,
          },
          (err, response) => {
            if (err) {
              console.error('Error retrieving email list:', err);
              reject(err);
              return;
            }

            const retrievedEmails = response.data.messages;
            nextPageToken = response.data.nextPageToken;

            if (retrievedEmails && retrievedEmails.length > 0) {
              const promises = retrievedEmails.map((email) => {
                return new Promise((resolve, reject) => {
                  gmailLimiter.schedule(() => {
                    return gmailApi.users.messages.get(
                      {
                        userId: 'me',
                        id: email.id,
                        format: 'full',
                      },
                      (err, response) => {
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
                        console.log(`new Email ${sentDate}`)
                        resolve(email);
                      }
                    );
                  });
                });
              });

              Promise.all(promises)
                .then((retrievedEmails) => {
                  emails.push(...retrievedEmails);

                  if (nextPageToken && emails.length < 4500) {
                    listMessages(); // Fetch next page of emails
                  } else {
                    resolve(emails.slice(0, 4500)); // Return only the first 4500 emails
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              resolve(emails.slice(0, 4500)); // Return only the first 4500 emails
            }
          }
        );
      });
    };

    listMessages(); // Start fetching emails
  });
};

const newToOldMailSort = async (emails) => {
  // latest -> oldest
  const newMail = await emails.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
  return newMail
}


const loadMailToDB = async (gmail, filter, userId, emailAddress, pageToken = null) => {
  const emails = [];

  const retrieveAndProcessEmail = async (emailId) => {
    return new Promise((resolve, reject) => {
      gmail.users.messages.get(
        {
          userId: 'me',
          id: emailId,
          format: 'full',
        },
        (err, response) => {
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
          User.findByIdAndUpdate(userId, { $push: { emails: email } }).exec();
          addEmailtoQdrant(emailAddress, sender, subject, body, gmailId, sentDate)
          resolve(email);
        }
      );
    });
  };

  return new Promise((resolve, reject) => {
    const processNextPage = async (pageToken) => {
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
            console.error('Error retrieving latest email:', err);
            reject(err);
            return;
          }

          const nextPageToken = response.data.nextPageToken;
          const retrievedEmails = response.data.messages;

          emails.push(...retrievedEmails);

          const promises = retrievedEmails.map((email) => retrieveAndProcessEmail(email.id));

          try {
            const processedEmails = await Promise.all(promises);
            resolve(processedEmails);
          } catch (err) {
            reject(err);
          }

          if (nextPageToken && emails.length < 750) {
            console.log(`loaded: ${emails.length}`);
            try {
              await processNextPage(nextPageToken);
            } catch (err) {
              reject(err);
            }
          } else {
            console.log(`Finished fetching and adding remaining 750 emails for user with ID: ${userId}`);
            const updatedUser = await User.findById(userId)
            const sortedMail = await newToOldMailSort(updatedUser.emails)
            //const sortedMail = updatedUser.emails

            await User.findByIdAndUpdate(
              userId,
              {
                latestEmail: sortedMail[0].sentDate,
                emails: sortedMail,
              }
            );
          }
        }
      );
    };

    processNextPage(pageToken); // Start fetching emails
  });
};




module.exports = {
  getGmailApiClient,
  loadMailToDB,
  getOnboardingMail,
  newToOldMailSort,
  getPostOnboardingMail
}

