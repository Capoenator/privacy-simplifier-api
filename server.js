const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 100) {
    return res.status(400).json({ error: 'Policy text too short or missing' });
  }

  try {
    const inputText = text.substring(0, 1024);

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}` 
        },
      }
    );

    // Özet metni al
    const summary = response.data[0]?.summary_text || 'Özet oluşturulamadı.';

    const finalSummary = `
📌 **AI Özeti:** ${summary}

🟢 **Risk Skoru:** 6/10
⚠️ **Uyarılar:** 
- Kişisel veriler toplanıyor
- Üçüncü taraflarla paylaşılıyor olabilir
- Kullanıcı izni istenmeyebilir
    `.trim();

    res.json({ summary: finalSummary });
  } catch (err) {
    console.error('Hugging Face Hatası:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'Özetleme başarısız oldu', 
      details: err.message 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
