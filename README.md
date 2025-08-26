# Twilio Conversation Relay Quickstart

A simple WebSocket server for Twilio Conversation Relay with ElevenLabs TTS and Deepgram transcription. Optimized for GitHub Codespaces.

## 🚀 Quick Start

### GitHub Codespaces
1. **Open in Codespaces** - Click the green "Code" button → Codespaces → Create
2. **Wait for setup** - Dependencies install automatically
3. **Run the server**: `npm start`
4. **Copy the webhook URL** from the terminal output
5. **Configure Twilio** phone number webhook to point to `/voice`

### Local Development
```bash
npm install
npm start
```

## 🔧 Features

- **ElevenLabs TTS** with custom voice configuration
- **Deepgram transcription** with nova-2-general model
- **DTMF detection** for keypad input
- **Auto-configuration** for GitHub Codespaces
- **Welcome greeting** on call start
- **Real-time voice processing**

## 📞 Twilio Setup

1. Go to [Twilio Console → Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Select your phone number
3. Set the webhook URL to: `your-server-url/voice`
   - **Codespaces**: `https://your-codespace-name-3000.preview.app.github.dev/voice`
   - **Local**: `https://your-ngrok-url.ngrok.io/voice` (use ngrok for local testing)
4. Save configuration
5. Call your number to test!

## 🔌 How It Works

1. **Incoming call** → Twilio calls your `/voice` webhook
2. **TwiML response** → Returns ConversationRelay with ElevenLabs/Deepgram config
3. **WebSocket connection** → Twilio connects to your server on port 8080
4. **Voice processing** → Server receives speech and responds with TTS

## 📋 Testing

- **Call your number** - hear "Hi! Ask me anything!" greeting
- **Speak** - server will echo back what you said
- **Press number keys** - server will announce which key you pressed
- **Check logs** - see real-time conversation events in the terminal

## �️ Voice Configuration

The server uses:
- **TTS Provider**: ElevenLabs
- **Voice**: Custom voice ID `6sFKzaJr574YWVu4UuJF-1.0_0.2_0.0`
- **Transcription**: Deepgram with nova-2-general model
- **Language**: English (en-US)
- **Interruption**: Disabled for smoother conversations

## �🌐 Platform-Specific Notes

### GitHub Codespaces
- Ports 3000 & 8080 auto-forward with public visibility
- Uses `.devcontainer` for consistent setup
- WebSocket URLs auto-generate with Codespaces domain

### Local Development
- Use ngrok to expose localhost to internet for Twilio webhooks
- Run `ngrok http 3000` to get public URL

## 🚨 Troubleshooting

- **WebSocket connection fails**: Check port forwarding is enabled
- **Webhook not receiving calls**: Verify URL is publicly accessible  
- **TwiML errors**: Check server logs for JSON parsing errors
- **No voice response**: Verify ElevenLabs/Deepgram configuration

## 📋 Message Types

The server handles these Conversation Relay message types:

- **setup** - Conversation initialization with session ID
- **prompt** - User speech input (echoes back with TTS)
- **dtmf** - Keypad input (announces pressed digit)
- **interrupt** - Speech interruption events
- **error** - Error messages from Twilio

## 🔧 Customization

To modify the voice behavior, edit the ConversationRelay configuration:

```javascript
connect.conversationRelay({
  url: getWebSocketUrl(),
  code: 'en-US',
  ttsProvider: 'elevenLabs',
  transcriptionProvider: 'deepgram',
  speechModel: 'nova-2-general',
  voice: 'your-voice-id-here',
  welcomeGreeting: 'Your custom greeting!'
});
```

---

**Ready to handle voice calls with AI-powered conversations! 🚀**
