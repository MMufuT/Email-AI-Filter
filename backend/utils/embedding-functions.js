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
  return await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: input
  })
    .then((response) => { response.data.data[0].embedding })
    .catch((error) => {
      console.error('Error occured while creating Open AI embedding: ' + error)
    })
}

const addEmailtoQdrant = async (emailAddress, sender, subject, body, gmailId, sentDate) => {
  input = `The following text is an email...\n\nSender: ${sender}
                \n\nSubject: ${subject}\n\nBody: ${body}`
  const embedding = createEmbedding(input) //embedding is 1536 dimensional array
  await qdrant.upsert(emailAddress, {
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
  .catch((error) => {
    console.error('Error occured while uploading vector to Qdrant database: ' + error)
  })
}

const createQdrantCollection = async (emailAddress) => {
    await qdrant.createCollection(emailAddress, {
      vectors: {
        size: 1536,
        distance: 'Cosine'
      }
    })
      .catch((error) => {
        console.error('Error occurred during Qdrant collection creation: ' + error);
      })
  }

module.exports = {
    createEmbedding,
    addEmailtoQdrant,
    createQdrantCollection
  }