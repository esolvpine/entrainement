const { OpenAI } = require('openai');
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENWEBUI_API_KEY,
  baseURL: process.env.OPENWEBUI_URL + '/api/v1'
});

module.exports = client;