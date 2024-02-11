const OpenAI = require('openai');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('public'));
app.use(cors());

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

app.get('/insights', async (req, res) => {
    try {
        const inputString = req.query.inputString;
        const generatedText = await generateText(inputString);
        res.send(generatedText);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
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
