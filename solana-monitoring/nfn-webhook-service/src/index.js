const express = require('express');
const dotenv = require('dotenv');
const logger = require('./logger');
const webhookApi = require('./webhookApi');
const { startEventListener } = require('./eventListener');

dotenv.config();

const app = express();
app.use(express.json());

// Mount webhook API routes
app.use('/api', webhookApi);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  // Start Solana event listener
  startEventListener();
});

module.exports = app;