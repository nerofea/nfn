const { Connection, PublicKey } = require('@solana/web3.js');
const logger = require('./logger');
const { dispatchEvent } = require('./eventDispatcher');

// Simulated program ID (replace with your actual NFN program ID later)
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // Placeholder

// Supported event types
const EVENT_TYPES = [
  'PurchaseConfirmed',
  'LoyaltyTokenMinted',
  'CampaignVoteCast'
];

async function startEventListener() {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
    logger.info('Connected to Solana RPC');

    // Subscribe to program logs
    connection.onLogs(
      PROGRAM_ID,
      (logs) => {
        // Simulate parsing logs for specific events
        const event = parseLogEvent(logs);
        if (event) {
          logger.info(`Detected event: ${event.type}`, { data: event.data });
          // Dispatch the event to registered webhooks
          dispatchEvent(event);
        }
      },
      'confirmed'
    );

    logger.info(`Subscribed to logs for program: ${PROGRAM_ID.toBase58()}`);
  } catch (error) {
    logger.error('Event listener error', { error: error.message });
  }
}

// Simulated log parsing (replace with actual log parsing logic based on your program)
function parseLogEvent(logs) {
  const logString = logs.logs.join(' ');
  
  for (const eventType of EVENT_TYPES) {
    if (logString.includes(eventType)) {
      return {
        type: eventType,
        data: {
          signature: logs.signature,
          timestamp: new Date().toISOString(),
          wallet: 'SAMPLE_WALLET_ADDRESS',
          productId: eventType === 'PurchaseConfirmed' ? 'SAMPLE_PRODUCT_ID' : undefined,
          tokenAmount: eventType === 'LoyaltyTokenMinted' ? 100 : undefined,
          campaignId: eventType === 'CampaignVoteCast' ? 'SAMPLE_CAMPAIGN_ID' : undefined
        }
      };
    }
  }
  return null;
}

module.exports = { startEventListener };