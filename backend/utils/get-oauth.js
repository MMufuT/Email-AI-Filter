require('dotenv').config()
const { google } = require('googleapis')


const getOAuthClient = async (user) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        `${process.env.BACKEND_URL}/auth/google/redirect`
    )
    await oAuth2Client.setCredentials({
        access_Token: user.accessToken,
        refresh_token: user.refreshToken
      })

      return oAuth2Client
}


  module.exports = getOAuthClient