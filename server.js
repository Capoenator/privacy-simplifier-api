const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route to summarize privacy policy
app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const prompt = `
Summarize this privacy policy in plain English (max 200 words).
Highlight: data collected, shared with, user rights, and risks.
Assign a risk score (1-10) and list red flags (e.g., "sells data").

Policy:
${text.substring(0, 3000)}...`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a privacy expert.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    res.json({ summary: response.data.choices[0].message.content.trim() });
  } catch (err) {
    console.error('AI Error Details:', JSON.stringify(err, null, 2));
    console.error('OpenAI Response:', err.response?.data);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
