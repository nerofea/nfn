const { Queue, Worker } = require('bullmq');
const Redis = require('redis');
const logger = require('./logger');
const axios = require('axios');

// Redis connection configuration
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

// Initialize BullMQ queue
const webhookQueue = new Queue('webhook-retries', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry 3 times
    backoff: {
      type: 'exponential',
      delay: 1000 // Start with 1-second delay
    }
  }
});

// Worker to process retry jobs
const worker = new Worker(
  'webhook-retries',
  async (job) => {
    const { event, webhook } = job.data;
    try {
      const response = await axios.post(webhook.url, event.data, {
        headers: webhook.headers || {},
        timeout: 5000
      });
      logger.info(`Webhook retry succeeded`, {
        event_type: event.type,
        url: webhook.url,
        status: response.status,
        attempt: job.attemptsMade + 1
      });
    } catch (error) {
      logger.error(`Webhook retry failed`, {
        event_type: event.type,
        url: webhook.url,
        attempt: job.attemptsMade + 1,
        error: error.message
      });
      throw error; // Let BullMQ handle retry
    }
  },
  { connection: redisConnection }
);

// Handle worker errors
worker.on('failed', (job, error) => {
  logger.error(`Webhook retry job failed after ${job.attemptsMade} attempts`, {
    event_type: job.data.event.type,
    url: job.data.webhook.url,
    error: error.message
  });
});

worker.on('completed', (job) => {
  logger.info(`Webhook retry job completed`, {
    event_type: job.data.event.type,
    url: job.data.webhook.url
  });
});

// Function to add webhook delivery to retry queue
async function queueWebhookRetry(event, webhook) {
  await webhookQueue.add('webhook-delivery', { event, webhook });
  logger.info(`Webhook delivery queued for retry`, {
    event_type: event.type,
    url: webhook.url
  });
}

module.exports = { queueWebhookRetry };