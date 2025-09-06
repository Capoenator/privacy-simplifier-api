app.post('/data-finder', async (req, res) => {
  const { name, surname, city, email } = req.body;

  if (!name || !surname) {
    return res.status(400).json({ error: 'Name and surname required' });
  }

  const searchName = `${name} ${surname}`;
  const searchQuery = encodeURIComponent(searchName);
  const location = city ? `&location=${encodeURIComponent(city)}` : '';

  try {
    // Gerçek sonuçlar alamayız (CORS), ama simüle edelim
    const results = [
      {
        site: "spokeo.com",
        url: `https://www.spokeo.com/search?name=${searchQuery}${location}`,
        found: true
      },
      {
        site: "zabasearch.com",
        url: `https://www.zabasearch.com/people/${searchQuery}/${city || ''}/`,
        found: true
      },
      {
        site: "intelius.com",
        url: `https://www.intelius.com/search/results?fullName=${searchQuery}`,
        found: false
      },
      {
        site: "fastbackgroundcheck.com",
        url: `https://www.fastbackgroundcheck.com/search?q=${searchQuery}`,
        found: true
      }
    ];

    res.json({ results, message: "These are potential data exposure sites. Visit manually to verify." });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});
