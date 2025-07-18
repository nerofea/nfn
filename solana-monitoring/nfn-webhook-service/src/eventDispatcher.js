const axios = require('axios');
const logger = require('./logger');
const { queueWebhookRetry } = require('./queue');

// In-memory webhook store (to be replaced with PostgreSQL later)
const webhooks = [];

async function dispatchEvent(event) {
  if (!event || !event.type || !event.data) {
    logger.error('Invalid event data', { event });
    return;
  }

  // Find webhooks matching the event type
  const matchingWebhooks = webhooks.filter((wh) => wh.event_type === event.type);

  if (matchingWebhooks.length === 0) {
    logger.info(`No webhooks registered for event: ${event.type}`);
    return;
  }

  // Send HTTP POST to each matching webhook
  for (const webhook of matchingWebhooks) {
    try {
      const response = await axios.post(webhook.url, event.data, {
        headers: webhook.headers || {},
        timeout: 5000 // 5-second timeout
      });
      logger.info(`Webhook delivered successfully`, {
        event_type: event.type,
        url: webhook.url,
        status: response.status
      });
    } catch (error) {
      logger.error(`Webhook delivery failed`, {
        event_type: event.type,
        url: webhook.url,
        error: error.message
      });
      // Queue for retry
      await queueWebhookRetry(event, webhook);
    }
  }
}

// Function to register a webhook (used by webhookApi.js)
function registerWebhook(event_type, url, headers) {
  if (!['PurchaseConfirmed', 'LoyaltyTokenMinted', 'CampaignVoteCast'].includes(event_type)) {
    throw new Error('Invalid event type');
  }
  webhooks.push({ event_type, url, headers });
  logger.info('Webhook registered', { event_type, url });
}

// Function to get all registered webhooks
function getWebhooks() {
  return webhooks;
}

module.exports = { dispatchEvent, registerWebhook, getWebhooks };