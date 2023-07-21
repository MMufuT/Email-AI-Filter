require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai')

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  }))
  
  // embedding method
  async function createEmbedding(input) {
  
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: input
    })
    return response.data.data[0].embedding
  }

  module.exports = createEmbedding