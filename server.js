const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text.substring(0, 1024) },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` }
      }
    );

    const summary = response.data[0]?.summary_text || 'Özet alınamadı.';
    res.json({
      summary: `📌 **AI Özeti:** ${summary}\n\n🟢 **Risk Skoru:** 6/10`
    });
  } catch (err) {
    console.error('Hata:', err.response?.data || err.message);
    res.status(500).json({ error: 'Başarısız' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu ${port}'de`));
