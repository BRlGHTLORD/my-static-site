// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;  // Use a port different from your front end

// Use CORS middleware to allow your front end to access this server
app.use(cors());

// Proxy endpoint for eBay API search
app.get('/api/ebay-search', async (req, res) => {
  const query = req.query.q || 'drone';
  const limit = req.query.limit || 3;
  const apiUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.EBAY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from eBay:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
