require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai')
const { QdrantClient } = require('@qdrant/js-client-rest')
const { v4: uuidv4 } = require('uuid')
const { onboardingQueue } = require('./queue')

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
})

const extractEmailAddress = async (emailString) => {
  const match = emailString.match(/<([^>]+)>/)
  return match && match[1] ? match[1] : emailString
}

const createEmbedding = async (input) => {
  return await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: input
  })
    .then((response) => { return response.data.data[0].embedding })
    .catch((error) => {
      console.log('Error occured while creating Open AI embedding: ' + error)
    })
}

const addEmailtoQdrant = async (emailAddress, sender, subject, body, gmailId, unixTimestamp) => {
  input = `The following text is an email...\n\nSender: ${sender}
                \n\nSubject: ${subject}\n\nBody: ${body}`
  const embedding = await createEmbedding(input)

  const senderEmailAddress = await extractEmailAddress(sender)

  await qdrant.upsert(emailAddress, {
    points: [{
      id: uuidv4(),
      vector: embedding,
      payload: {
        sender: senderEmailAddress,
        gmailId: gmailId,
        sentDate: unixTimestamp
      }
    }]
  })
    .catch((error) => {
      console.error('Error occured while uploading vector to Qdrant database (Log error for more info):')
    })
}

const createQdrantCollection = async (emailAddress) => {
  await qdrant.createCollection(emailAddress, {
    vectors: {
      size: 1536,
      distance: 'Cosine',
      on_disk: true
    },
    on_disk_payload: true
  })
    .catch((error) => {
      console.error('Error occurred during Qdrant collection creation:', error)
    })
}

const deleteQdrantCollection = async (emailAddress) => {
  await qdrant.deleteCollection(emailAddress)
    .catch((error) => {
      console.error('Error occurred during Qdrant collection deletion:', error)
      return false
    })
  return true
}

const getSearchResults = async (userEmail, query, senderEmailAddress, range) => {

  const currentUnixTime = Math.floor(Date.now() / 1000)
  const queryVector = await createEmbedding(query)
  const results = await qdrant.search(userEmail, {
    vector: queryVector,
    limit: 50,
    with_payload: {
      include: ['gmailId']
    },
    filter: senderEmailAddress ? {
      must: [
        {
          key: 'sender',
          match: { value: senderEmailAddress },
          range: {
            lte: range.before ? range.before : currentUnixTime,
            gte: range.after ? range.after : 0
          }
        },
        {
          key: 'sentDate',
          range: {
            lte: range.before ? range.before : currentUnixTime,
            gte: range.after ? range.after : 0
          }
        }
      ]
    } : {
      must: [
        {
          key: 'sentDate',
          range: {
            lte: range.before ? range.before : currentUnixTime,
            gte: range.after ? range.after : 0
          }
        }
      ]
    }
  })
    .catch((error) => {
      console.error('Error occurred during Qdrant vector search:', error)
    })

  return results
}


module.exports = {
  createEmbedding,
  addEmailtoQdrant,
  createQdrantCollection,
  deleteQdrantCollection,
  getSearchResults
}