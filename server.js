const express = require('express');
const WebSocket = require('ws');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
app.use(express.json());

// Get WebSocket URL
function getWebSocketUrl() {
  // GitHub Codespaces
  if (process.env.CODESPACE_NAME) {
    return `wss://${process.env.CODESPACE_NAME}-8080.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/websocket`;
  }
  return `ws://localhost:8080/websocket`;
}

// TwiML endpoint for voice calls
app.post('/voice', (req, res) => {
  console.log('📞 Incoming call');

  const response = new VoiceResponse();
  const connect = response.connect();

  connect.conversationRelay({
    url: getWebSocketUrl(),
    code: 'en-US',
    ttsProvider: 'elevenLabs',
    transcriptionProvider: 'deepgram',
    speechModel: 'nova-2-general',
    voice: '6sFKzaJr574YWVu4UuJF-1.0_0.2_0.0',
    interruptible: 'none',
    dtmfDetection: true,
    reportInputDuringAgentSpeech: 'none',
    // welcomeGreeting: 'Hi! Ask me anything!'
  });

  console.log(response.toString());

  res.type('text/xml');
  res.send(response.toString());
});

// WebSocket server for Conversation Relay
const wss = new WebSocket.Server({
  port: 8080,
  path: '/websocket'
});

wss.on('connection', (ws) => {
  console.log('🔗 New Conversation Relay connection');

  ws.on('message', (data) => {
    let message;
    try { 
      message = JSON.parse(data); 
    } catch (e) { 
      return; 
    }
    
    switch (message.type) {
      case 'setup':
        console.log('🚀 Conversation setup', message.sessionId);
        break;

      case 'prompt':
        console.log(`🎤 User said: "${message.voicePrompt}"`);
        // IMPORTANT: finish the talk cycle with last: true
        ws.send(JSON.stringify({
          type: 'text',
          token: `You said: ${message.voicePrompt}`,
          last: true
        }));
        break;

      case 'interrupt':
        console.log('⏹️ Speech interrupted');
        break;

      case 'dtmf':
        console.log(`📞 DTMF: ${message.digit}`); // field is "digit"
        ws.send(JSON.stringify({
          type: 'text',
          token: `You pressed ${message.digit}`,
          last: true
        }));
        break;

      case 'error':
        console.error('❌ Twilio error:', message.description);
        break;
    }
  });

  ws.on('close', () => {
    console.log('🔌 Connection closed');
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔗 WebSocket running on port 8080`);
  console.log(`📞 Voice webhook: /voice`);
  
  if (process.env.CODESPACE_NAME) {
    console.log(`🌐 Voice webhook URL: https://${process.env.CODESPACE_NAME}-${port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/voice`);
  }
});
