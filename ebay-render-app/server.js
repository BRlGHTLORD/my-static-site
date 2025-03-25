// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS so your front end can access this server
app.use(cors());

// Proxy endpoint for eBay API

app.get('/api/ebay-search', async (req, res) => {
  const query = req.query.q || 'drone';
  const limit = req.query.limit || 3;
  const ebayUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  console.log("Fetching from eBay URL:", ebayUrl);

  try {
    const response = await axios.get(ebayUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.EBAY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("eBay API response received");
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from eBay:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});
