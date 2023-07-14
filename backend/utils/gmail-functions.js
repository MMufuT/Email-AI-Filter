const { google } = require('googleapis');
const { Configuration, OpenAIApi } = require('openai')

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}))


const getGmailApiClient = (accessToken) => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    return gmail;
  }

  const getLatestEmail = (gmail) => {
    gmail.users.messages.list(
      {
        userId: 'me',
        labelIds: ['INBOX'],
        maxResults: 1,
        q: 'in:inbox', // Optional: You can use additional search parameters if needed
        orderBy: 'internalDate desc', // Sort messages by internalDate in descending order
      },
      (err, response) => {
        if (err) {
          console.error('Error retrieving latest email:', err);
          return;
        }
  
        const latestEmail = response.data.messages[0];
        console.log('Latest email:', latestEmail);
        // Process the latest email as needed
      }
    );
  }


module.exports = {
    getGmailApiClient,
    getLatestEmail
}