require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const twilio = require('twilio');
const OpenAI = require('openai');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = 8080;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Twilio client for making calls
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store active games and call sessions
const activeGames = new Map();
const callSessions = new Map();

// Get WebSocket URL
function getWebSocketUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'wss' : 'ws';
  const host = req.headers.host;
  return `${protocol}://${host}/websocket`;
}

// BATTLESNAKE ENDPOINTS
app.get('/', (req, res) => {
  res.json({
    apiversion: '1',
    author: 'ai-commentator',
    color: '#FF6B6B',
    head: 'default',
    tail: 'default'
  });
});

app.post('/start', async (req, res) => {
  const { game } = req.body;
  console.log(`🐍 Game ${game.id} started!`);

  // Initiate Twilio call for live commentary
  if (process.env.TARGET_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER && process.env.PUBLIC_URL) {
    try {
      const call = await client.calls.create({
        url: `${process.env.PUBLIC_URL}/voice`,
        to: process.env.TARGET_PHONE_NUMBER,
        from: process.env.TWILIO_PHONE_NUMBER,
        method: 'POST'
      });
      
      console.log(`📞 Commentary call initiated: ${call.sid}`);
      activeGames.set(game.id, null);
      
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
    }
  }

  res.json({});
});

app.post('/move', async (req, res) => {
  const gameData = req.body;
  
  try {
    const commentary = await generateCommentary(gameData);
    broadcastCommentary(gameData.game.id, commentary);
  } catch (error) {
    console.error('❌ Commentary failed:', error);
  }

  res.json({ move: 'up' });
});

app.post('/end', async (req, res) => {
  const { game } = req.body;
  console.log(`🏁 Game ${game.id} ended!`);
  
  broadcastCommentary(game.id, "Game over! Thanks for listening to Battlesnake Live!");
  activeGames.delete(game.id);
  
  res.json({});
});

// TwiML endpoint for voice calls
app.post('/voice', (req, res) => {
  console.log('📞 Incoming call for Battlesnake commentary');

  const response = new VoiceResponse();
  const connect = response.connect();

  connect.conversationRelay({
    url: getWebSocketUrl(req),
    code: 'en-US',
    ttsProvider: 'elevenLabs',
    transcriptionProvider: 'deepgram', 
    speechModel: 'nova-2-general',
    voice: '6sFKzaJr574YWVu4UuJF-1.0_0.2_0.0',
    interruptible: 'none',
    dtmfDetection: true,
    reportInputDuringAgentSpeech: 'none'
  });

  res.type('text/xml');
  res.send(response.toString());
});

// SIMPLE AI COMMENTARY GENERATION
async function generateCommentary(gameData) {
  const { turn, board, you } = gameData;
  
  const summary = `Turn ${turn}: ${board.snakes.length} snakes, our snake has ${you.health} health and length ${you.length}, ${board.food.length} food available`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an energetic sports commentator for Battlesnake games. Keep it brief (1 sentence), exciting, and focused on the action."
      },
      {
        role: "user", 
        content: `Provide exciting commentary for: ${summary}`
      }
    ],
    max_tokens: 50,
    temperature: 0.8
  });

  return response.choices[0].message.content.trim();
}

function broadcastCommentary(gameId, commentary) {
  const sessionId = activeGames.get(gameId);
  if (sessionId) {
    const ws = callSessions.get(sessionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`🎙️ ${commentary}`);
      ws.send(JSON.stringify({
        type: 'text',
        token: commentary,
        last: true
      }));
    }
  }
}

// WebSocket server for Conversation Relay
const wss = new WebSocket.Server({
  port: WEBSOCKET_PORT,
  path: '/websocket'
});

wss.on('connection', (ws) => {
  console.log('🔗 New Conversation Relay connection');
  let sessionId = null;

  ws.on('message', (data) => {
    let message;
    try { 
      message = JSON.parse(data); 
    } catch (e) { 
      return; 
    }
    
    switch (message.type) {
      case 'setup':
        sessionId = message.sessionId;
        callSessions.set(sessionId, ws);
        console.log('🚀 Call session started:', sessionId);
        
        // Link to any waiting game
        for (const [gameId, linkedSessionId] of activeGames.entries()) {
          if (linkedSessionId === null) {
            activeGames.set(gameId, sessionId);
            ws.send(JSON.stringify({
              type: 'text',
              token: 'Welcome to AI Battlesnake Commentary!',
              last: true
            }));
            break;
          }
        }
        break;

      case 'prompt':
        console.log(`🎤 User said: "${message.voicePrompt}"`);
        ws.send(JSON.stringify({
          type: 'text',
          token: 'Thanks for listening to Battlesnake Live!',
          last: true
        }));
        break;

      case 'interrupt':
        console.log('⏹️ Speech interrupted');
        break;

      case 'dtmf':
        console.log(`📞 DTMF: ${message.digit}`);
        break;

      case 'error':
        console.error('❌ Twilio error:', message.description);
        break;
    }
  });

  ws.on('close', () => {
    console.log('🔌 Connection closed');
    if (sessionId) {
      callSessions.delete(sessionId);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`� Battlesnake AI Commentary Server running on port ${PORT}`);
  console.log(`🎙️ WebSocket server running on port ${WEBSOCKET_PORT}`);
  console.log(`📞 Voice webhook: ${process.env.PUBLIC_URL || 'http://localhost:' + PORT}/voice`);
  console.log(`🌐 Battlesnake URL: ${process.env.PUBLIC_URL || 'http://localhost:' + PORT}`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - commentary will fail');
  }
  if (!process.env.PUBLIC_URL) {
    console.warn('⚠️  PUBLIC_URL not set - use ngrok or set your tunnel URL');
  }
});
