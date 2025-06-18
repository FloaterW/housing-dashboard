const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./config/database');
const logger = require('./config/logger');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/test/sales', async (req, res) => {
  try {
    const { rows } = await database.query(`
      SELECT 
        ps.id,
        ps.sale_date,
        ps.sale_price,
        ps.list_price,
        r.name as region_name,
        ht.name as housing_type_name
      FROM property_sales ps
      JOIN regions r ON ps.region_id = r.id
      JOIN housing_types ht ON ps.housing_type_id = ht.id
      ORDER BY ps.sale_date DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('Error:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      message: error.message
    });
  }
});

async function startServer() {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`Test API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();