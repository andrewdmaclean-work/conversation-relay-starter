const express = require('express');
const WebSocket = require('ws');
const { VoiceResponse } = require('twilio').twiml;

const app = express();
app.use(express.json());

// Get WebSocket URL
function getWebSocketUrl() {
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `wss://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/websocket`;
  }
  return `ws://localhost:3000/websocket`;
}

// TwiML endpoint for voice calls
app.post('/voice', (req, res) => {
  console.log('📞 Incoming call');
  
  const response = new VoiceResponse();
  const connect = response.connect();
  connect.conversationRelay({
    url: getWebSocketUrl()
  });

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
    try {
      const message = JSON.parse(data);
      console.log('📨 Received:', message.type);
      
      switch (message.type) {
        case 'setup':
          console.log('🚀 Conversation setup');
          break;
        case 'prompt':
          console.log(`🎤 User said: "${message.voicePrompt}"`);
          // Echo back what the user said
          ws.send(JSON.stringify({
            type: 'say',
            text: `You said: ${message.voicePrompt}`
          }));
          break;
        case 'interrupt':
          console.log('⏹️ Speech interrupted');
          break;
        case 'dtmf':
          console.log(`📞 DTMF: ${message.dtmf}`);
          ws.send(JSON.stringify({
            type: 'say',
            text: `You pressed ${message.dtmf}`
          }));
          break;
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
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
  console.log(`🔗 WebSocket: ${getWebSocketUrl()}`);
  console.log(`📞 Voice webhook: /voice`);
});
