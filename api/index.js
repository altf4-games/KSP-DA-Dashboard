const OpenAI = require('openai');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

app.get('/api/v1/insights', async (req, res) => {
    try {
      const inputString = req.query.inputString;
      const generatedText = await generateText(inputString);
      res.json(generatedText);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
});

async function generateText(parameter) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `${parameter}` }],
    model: 'gpt-3.5-turbo',
  });
  return chatCompletion;
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
