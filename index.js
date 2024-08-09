const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/ip', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch IP information' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});