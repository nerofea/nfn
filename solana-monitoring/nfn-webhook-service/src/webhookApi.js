const express = require('express');
const logger = require('./logger');
const { registerWebhook, getWebhooks } = require('./eventDispatcher');

const router = express.Router();

// Register a new webhook
router.post('/register-webhook', (req, res) => {
  const { event_type, url, headers } = req.body;

  if (!event_type || !url) {
    logger.error('Invalid webhook registration data', { body: req.body });
    return res.status(400).json({ error: 'event_type and url are required' });
  }

  try {
    registerWebhook(event_type, url, headers || {});
    res.status(201).json({ message: 'Webhook registered successfully' });
  } catch (error) {
    logger.error('Webhook registration failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

// List all registered webhooks
router.get('/webhooks', (req, res) => {
  const webhooks = getWebhooks();
  logger.info('Listing registered webhooks', { count: webhooks.length });
  res.status(200).json(webhooks);
});

module.exports = router;