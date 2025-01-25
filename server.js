// server.js
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import pkg from 'body-parser';
const app = express();
const port = 3001; // Use a different port than your frontend
const { json } = pkg;
const openai = new OpenAI({
  apiKey: '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',
});

app.use(cors());
app.use(json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [{ role: 'user', content: message }],
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('Error fetching completion:', error);
    res.status(500).send('Error fetching completion');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});