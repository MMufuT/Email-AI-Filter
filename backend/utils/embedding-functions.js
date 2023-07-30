require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai')
const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// embedding method
const createEmbedding = async (input) => {

  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: input
  })
  return response.data.data[0].embedding
}

const addEmailtoQdrant = async (emailAddress, sender, subject, body, gmailId, sentDate) => {

  input = `The following text is an email...\n\nSender: ${sender}
                \n\nSubject: ${subject}\n\nBody: ${body}`
  const embedding = await createEmbedding(input) //embedding is an array

  qdrant.upsert(emailAddress, {
    points: [{
      id: uuidv4(), // Universally Unique Identifier
      vector: embedding,
      payload: {
        sender: sender,
        gmailId: gmailId,
        sentDate: sentDate
      }
    }]
  })
}

const createQdrantCollection = (emailAddress) => {
  try {
    qdrant.createCollection(emailAddress, {
      vectors: {
        size: 1536,
        distance: 'Cosine'
      }

    })
  } catch (error) {
    console.error('Error occurred during upsert:', error.message);
    return res.status(500).json({ error: 'An error occured while creating Qdrarnt Vector Database collection' })
  }
}

module.exports = {
  createEmbedding,
  addEmailtoQdrant,
  createQdrantCollection
}