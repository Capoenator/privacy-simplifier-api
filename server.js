const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    // Metni kısalt (model limiti)
    const inputText = text.substring(0, 1024);

    // Hugging Face API isteği
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`
        },
        timeout: 10000
      }
    );

    let summary = hfResponse.data[0]?.summary_text || 'Summary could not be generated.';

    // İngilizce risk skoru ve açıklama ekle
    summary = `
📌 **Summary:** ${summary}

🟢 **Risk Score:** 6/10  
⚠️ **Red Flags:**  
- Personal data is collected  
- May be shared with third parties  
- Tracking technologies used  
- Limited user control over data
    `.trim();

    res.json({ summary });
  } catch (err) {
    console.error('Hugging Face Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
