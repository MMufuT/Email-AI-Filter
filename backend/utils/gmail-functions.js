require('dotenv').config();
const { google } = require('googleapis');
const { Configuration, OpenAIApi } = require('openai')
const bluePrint = require('./instructions')





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


const getOnboardingMail = (gmail) => {
  return new Promise((resolve, reject) => {
    const emails = [];
    gmail.users.messages.list(
      {
        userId: 'me',
        labelIds: ['INBOX'],
        maxResults: 250,
        q: 'in:inbox',
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


const newToOldMailSort = async(emails) => {
  // latest -> oldest
  await emails.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
}






const loadMailToDB = (gmail, pageToken = null, emails = []) => {
  gmail.users.messages.list(
    {
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 500,
      q: 'in:inbox', // Optional: You can use additional search parameters if needed
      orderBy: 'internalDate desc', // Sort messages by internalDate in descending order
      includeSpamTrash: false, //this can be edited by user
      pageToken: pageToken
    },
    async (err, response) => {
      if (err) {
        console.error('Error retrieving latest email:', err);
        return;
      }

      const nextPageToken = response.data.nextPageToken;
      const retrievedEmails = response.data.messages;

      emails.push(...retrievedEmails)

      for (let email of retrievedEmails) {
        const emailId = email.id;
        gmail.users.messages.get(
          {
            userId: 'me',
            id: emailId,
            format: 'full',
          },
          async (err, response) => {
            if (err) {
              console.error('Error retrieving email:', err);
              return;
            }

            const rawEmailData = response.data;
            const headers = rawEmailData.payload.headers;
            const senderHeader = headers.find((header) => header.name === 'From');
            const sender = senderHeader ? senderHeader.value : 'No Sender';

            const subjectHeader = headers.find((header) => header.name === 'Subject');
            const subject = subjectHeader ? subjectHeader.value : 'No Subject';

            const body = rawEmailData.snippet ? rawEmailData.snippet : 'No Body';

            const simpleEmailData = { sender, subject, body };// load this + emailID onto 
            const query = 'search for any emails that are receipts or order confirmations'

            // openAI chat completion search function
            // const isMatch = await compareQueryWithEmail(email, query)

            //openAI embeddings search function


            //console.log(embedding)
            //console.log(emailData)
          }
        );
      }
      if (nextPageToken) {
        loadMailToDB(gmail, nextPageToken, emails)
      }
      console.log(emails.length)
    }
  );
}


module.exports = {
  getGmailApiClient,
  loadMailToDB,
  getOnboardingMail,
  newToOldMailSort
}

