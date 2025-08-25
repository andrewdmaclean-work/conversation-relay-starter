# Twilio WebSocket Relay Server - Replit Starter

A simple WebSocket server for relaying Twilio conversations in real-time. This is a Replit starter template that makes it easy to deploy and test Twilio WebSocket integration.

## 🚀 Quick Start on Replit

1. **Fork this Repl** or use it as a template
2. **Configure Twilio Secrets** (see setup section below)
3. **Click Run** - the server will start automatically
4. **Open the app** - Replit will show you the client interface
5. **Start testing** with your Twilio conversations!

## 🔧 Replit Setup

### Add Twilio Credentials to Secrets

In your Replit, go to the **Secrets** tab (🔒) and add these environment variables:

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=your_api_key_here
TWILIO_API_SECRET=your_api_secret_here
```

### Get Your Twilio Credentials

1. **Sign up for Twilio** at [twilio.com](https://twilio.com)
2. **Account SID & Auth Token**: Found on your [Twilio Console Dashboard](https://console.twilio.com)
3. **API Key & Secret**: Create them in [API Keys section](https://console.twilio.com/project/api-keys)

## ✨ Features

- WebSocket server for real-time communication
- Twilio Conversations API integration
- JWT access token generation
- Webhook support for conversation events
- Built-in HTML client for testing
- Message broadcasting to all connected clients
- **Replit-optimized** with auto-configuration
- **One-click deployment** ready

## 🌐 Replit Deployment

The app automatically detects Replit environment and configures:
- **WebSocket URLs** for your specific Replit instance
- **HTTPS/WSS** support for production
- **Health checks** and monitoring endpoints
- **Auto-restart** on code changes

### URLs (auto-generated)
- **App Interface**: `https://your-repl-name.your-username.repl.co`
- **WebSocket**: `wss://your-repl-name.your-username.repl.co:8080`
- **Health Check**: `https://your-repl-name.your-username.repl.co/health`
- **Webhook**: `https://your-repl-name.your-username.repl.co/webhook/conversation`

## 📱 Local Development

## 📱 Local Development

If you want to run this locally instead of on Replit:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Twilio credentials

3. **Start the server:**
   ```bash
   npm start
   ```

## 🔌 Usage

### Server Endpoints

- **WebSocket**: Auto-detected (WSS for Replit, WS for local)
- **HTTP Server**: Your Replit app URL or `http://localhost:3000`
- **Health Check**: `GET /health`
- **Configuration**: `GET /config` (auto-configuration endpoint)
- **Webhook**: `POST /webhook/conversation`

### Testing with Built-in Client

1. **Open your Replit app** (or `client.html` locally)
2. **WebSocket URL** will be auto-detected
3. **Click Connect** to establish WebSocket connection
4. **Enter Conversation Details**:
   - Conversation SID (from Twilio Console)
   - Your participant identity (any unique string)
5. **Join conversation** and start messaging!

## 📋 Testing Checklist

### Before You Start
- [ ] Twilio account created
- [ ] API keys generated in Twilio Console
- [ ] Secrets added to Replit
- [ ] Repl is running

### Create a Test Conversation
1. Go to [Twilio Console > Conversations](https://console.twilio.com/us1/develop/conversations/manage/conversations)
2. Create a new Conversation
3. Copy the Conversation SID (starts with `CH...`)
4. Use this SID in the client interface

## 🔧 Advanced Configuration

### WebSocket Messages

#### Join Conversation
```json
{
  "type": "join_conversation",
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "participantIdentity": "user123"
}
```

#### Send Message
```json
{
  "type": "send_message",
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "messageBody": "Hello, world!",
  "author": "John Doe"
}
```

#### Leave Conversation
```json
{
  "type": "leave_conversation",
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "participantIdentity": "user123"
}
```

### Testing with HTML Client

1. Start the server
2. Open `client.html` in your browser
3. Connect to the WebSocket server
4. Enter your Twilio Conversation SID and participant identity
5. Join the conversation and start sending messages

## Twilio Setup

1. **Create a Twilio Account** and get your Account SID and Auth Token
2. **Create API Keys** in the Twilio Console
3. **Create a Conversations Service** (optional, for managing conversations)
4. **Set up Webhooks** (optional, point to `http://your-server/webhook/conversation`)

### Environment Variables

| Variable | Description | Required | Replit Location |
|----------|-------------|----------|-----------------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Yes | Secrets tab 🔒 |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Yes | Secrets tab 🔒 |
| `TWILIO_API_KEY` | Your Twilio API Key | Yes | Secrets tab 🔒 |
| `TWILIO_API_SECRET` | Your Twilio API Secret | Yes | Secrets tab 🔒 |
| `PORT` | HTTP server port | No | Auto-set by Replit |
| `REPL_SLUG` | Replit app name | No | Auto-set by Replit |
| `REPL_OWNER` | Replit username | No | Auto-set by Replit |

### Webhook Configuration

Set your webhook URL in Twilio Console to:
```
https://your-repl-name.your-username.repl.co/webhook/conversation
```

## 🚨 Troubleshooting

### "Twilio credentials not configured"
- Check that all 4 Twilio secrets are added to Replit
- Restart your Repl after adding secrets

### WebSocket connection fails
- Make sure you're using the correct URL (auto-detected)
- Check if Replit is sleeping (it auto-wakes on requests)

### Can't join conversation
- Verify the Conversation SID is correct (starts with `CH`)
- Check that your Twilio credentials have Conversations API access

## 🔗 Useful Links

- [Twilio Console](https://console.twilio.com)
- [Twilio Conversations API](https://www.twilio.com/docs/conversations)
- [Replit Documentation](https://docs.replit.com)

## 🚀 Production Considerations

- ✅ **HTTPS/WSS** automatically enabled on Replit
- ⚠️ **Authentication** - implement for production use
- ⚠️ **Rate limiting** - add for production workloads
- ✅ **Logging** - basic logging included
- ⚠️ **Error monitoring** - add services like Sentry
- ✅ **Auto-restart** - handled by Replit
- ⚠️ **Scaling** - consider Redis for multi-instance deployments

## 📄 License

MIT

---

**Ready to start building with Twilio WebSockets? Just click Run! 🚀**
