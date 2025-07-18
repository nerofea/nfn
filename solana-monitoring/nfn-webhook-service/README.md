# Solana Webhook Listener & Event Dispatcher (NFN)

A modular Node.js microservice that listens to Solana on-chain events and triggers webhooks in real-time. Perfect for product purchases, loyalty token mints, campaign voting, and more!

---

## 🚀 Features
- Listens to Solana logs for custom events
- Triggers HTTP webhooks based on event type
- Retry logic with BullMQ + Redis (3 tries, exponential backoff)
- Webhook management API (register/list)
- Logging to file (`logs/app.log`) and console

---

## 🛠️ Stack
- Node.js (JavaScript)
- Express
- @solana/web3.js
- BullMQ + Redis
- Winston (logging)

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd solana
npm install
```

### 2. Environment Variables
Create a `.env` file in the root with:
```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com # Or your custom endpoint
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Redis (locally)
- [Install Redis](https://redis.io/docs/getting-started/)
- Start Redis server:
  ```bash
  redis-server
  ```

### 4. Run the Service
```bash
npm start
```

---

## 🔗 API Endpoints

### Register a Webhook
```bash
curl -X POST http://localhost:3000/register-webhook \
  -H 'Content-Type: application/json' \
  -d '{
    "event_type": "PurchaseConfirmed",
    "url": "https://your-webhook.site/endpoint",
    "headers": {"Authorization": "Bearer xyz"}
  }'
```

### List Registered Webhooks
```bash
curl http://localhost:3000/webhooks
```

---

## ⚙️ How It Works
- Listens to Solana logs for these events:
  - `PurchaseConfirmed`
  - `LoyaltyTokenMinted`
  - `CampaignVoteCast`
- When an event is detected, all registered webhooks for that event type are triggered with a POST request.
- If delivery fails, it is retried up to 3 times with exponential backoff (BullMQ + Redis).
- All deliveries and retries are logged in `logs/app.log`.

---

## 📝 Configuration & Customization
- **Solana Program ID:**
  - Update `PROGRAM_ID` in `src/eventListener.js` with your actual program ID.
- **Log Parsing:**
  - Update `parseLogEvent` in `src/eventListener.js` for your real log format.
- **Port:**
  - Default Express port is 3000. Change in `src/index.js` if needed.

---

## 🧰 Troubleshooting
- **Redis connection error?**
  - Make sure Redis is running and `REDIS_HOST`/`REDIS_PORT` are correct.
- **No events detected?**
  - Check your Solana RPC URL and program ID.
- **Webhooks not firing?**
  - Check logs in `logs/app.log` for errors.

---

## 👨‍💻 Local Development Tips
- Use [ngrok](https://ngrok.com/) to expose local endpoints for webhook testing.
- Tail logs: `tail -f logs/app.log`
- Restart service after changing environment variables.

---

## 📚 Resources
- [Solana logsSubscribe docs](https://docs.solana.com/developing/clients/jsonrpc-api#logsSubscribe)
- [BullMQ Guide](https://docs.bullmq.io/)
- [Webhooks Best Practices](https://stripe.com/docs/webhooks)

---

