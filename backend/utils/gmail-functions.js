require('dotenv').config()
const { google } = require('googleapis')
const User = require('../models/userSchema')
const { addEmailtoQdrant } = require('./embedding-functions')
const { promisify } = require('util')
const { onboardingRateLimiter } = require('./rate-limits')

/*
This function checks if the user's access token is expiring soon
If the token is expiring soon, this function will refresh the token
*/
const validateAccess = async (oAuth2Client, user) => {
  if (oAuth2Client.isTokenExpiring()) {
    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken
    })
    user.accessToken = oAuth2Client.getAccessToken()
  }
}

const getGmailApiClient = async (oAuth2Client, user) => {
  await validateAccess(oAuth2Client, user)
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
    return gmail
  } catch (error) {
    console.error('Error occured while getting Gmail API Client')
  }
}

/*
This function gets the the last 250 emails from the client during the 
POST /onboarding/loading API call.
*/
const getOnboardingMail = (gmail, filter) => {
  return new Promise((resolve, reject) => {
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
          console.error('Error retrieving latest email')
          reject(err)
          return
        }

        const retrievedEmails = response.data.messages
        const promises = []

        for (let email of retrievedEmails) {
          const emailId = email.id

          const promise = new Promise((resolve, reject) => {
            gmail.users.messages.get(
              {
                userId: 'me',
                id: emailId,
                format: 'full',
              },
              async (err, response) => {
                if (err) {
                  console.error('Error retrieving email')
                  reject(err)
                  return
                }

                const rawEmailData = response.data
                const headers = rawEmailData.payload.headers

                const senderHeader = headers.find((header) => header.name === 'From')
                const sender = senderHeader ? senderHeader.value : 'No Sender'

                const subjectHeader = headers.find((header) => header.name === 'Subject')
                const subject = subjectHeader ? subjectHeader.value : 'No Subject'

                const body = rawEmailData.snippet ? rawEmailData.snippet : 'No Body'

                const gmailId = rawEmailData.id ? rawEmailData.id : 'No Gmail ID'


                const sentDate = new Date(parseInt(rawEmailData.internalDate))

                const email = { sender, subject, body, sentDate, gmailId }
                resolve(email)
              }
            )
          })

          promises.push(promise)
        }

        Promise.all(promises)
          .then((emails) => {
            resolve(emails)
          })
          .catch((err) => {
            reject(err)
          })
      }
    )
  })
}

// Sorts the emails fetched from Gmail API from newest(0) to oldest(length-1)
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

  newMail.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate))
  return newMail
}

/*
This function gets the remaining 750 emails from the client in the Bull Queue process
after the user finished onboarding. There are 1000 emails loaded (250 onnboarding + 750 remaining)
in the user's database.
*/
const loadMailToDB = async (gmail, filter, userId, emailAddress, pageToken = null) => {
  let batchesLoaded = 0 // 750 emails will be loaded in 3 batches (3 x 250 emails)
  const getEmailAsync = promisify(gmail.users.messages.get.bind(gmail.users.messages))
  const listMessagesAsync = promisify(gmail.users.messages.list.bind(gmail.users.messages))


  const retrieveAndProcessEmail = async (emailId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await getEmailAsync({
          userId: 'me',
          id: emailId,
          format: 'full',
        })

        const rawEmailData = response.data
        const headers = rawEmailData.payload.headers

        const senderHeader = headers.find((header) => header.name === 'From')
        const sender = senderHeader ? senderHeader.value : 'No Sender'

        const subjectHeader = headers.find((header) => header.name === 'Subject')
        const subject = subjectHeader ? subjectHeader.value : 'No Subject'

        const body = rawEmailData.snippet ? rawEmailData.snippet : 'No Body'

        const gmailId = rawEmailData.id ? rawEmailData.id : 'No Gmail ID'

        const unixTimestamp = rawEmailData.internalDate
        const sentDate = new Date(parseInt(unixTimestamp))

        const email = { sender, subject, body, sentDate, gmailId }

        await Promise.all([
          addEmailtoQdrant(emailAddress, sender, subject, body, gmailId, unixTimestamp),
          User.findByIdAndUpdate(userId, { $push: { emails: email } }).exec(),
        ])

        resolve(email)
      } catch (error) {
        console.error('Error retrieving email')
        reject(error)
      }
    })



  }


  return new Promise(async (resolve, reject) => {
    const processNextPage = async (pageToken) => {
      // console.log(pageToken) (Development only)
      try {
        const response = await listMessagesAsync({
          userId: 'me',
          labelIds: ['INBOX'],
          maxResults: 250,
          q: filter,
          orderBy: 'internalDate desc',
          includeSpamTrash: false,
          pageToken: pageToken,
        })


        const nextPageToken = response.data.nextPageToken
        const retrievedEmails = response.data.messages

        //async await here if doesnt work
        await Promise.all(retrievedEmails.map((email) => {
          //await retrieveAndProcessEmail(email.id)
          onboardingRateLimiter.schedule(() => retrieveAndProcessEmail(email.id))
        }))

        batchesLoaded++
        emailsLoaded = batchesLoaded * 250
        if (nextPageToken && batchesLoaded < 3) {
          // console.log(`loaded: ${emailsLoaded}`) (Development only)
          // console.log(onboardingRateLimiter.counts()) (Development only)
          processNextPage(nextPageToken)
        } else {
          // console.log(`Finished adding remaining 750 emails to worker queue user with ID: ${userId}`) (Development only)
          resolve()
          return
        }

        // // Push individual email objects to the emails array
        // retrievedEmails.forEach((email) => {
        //   emails.push(email)
        // })
      } catch (error) {
        console.error('Error while fetching 250 Emails')
        reject(error)
        return
      }

    }

    processNextPage(pageToken) // Start fetching emails
  })
}




module.exports = {
  getGmailApiClient,
  loadMailToDB,
  getOnboardingMail,
  newToOldMailSort,
}

