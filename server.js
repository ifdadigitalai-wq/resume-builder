const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerStr, payloadStr, signatureStr] = parts;
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    
    const verifiedSig = crypto
      .createHmac('sha256', secret)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64url');

    if (verifiedSig !== signatureStr) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });
  const clients = new Map();

  server.on('upgrade', (request, socket, head) => {
    const parsedUrl = parse(request.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/api/ws') {
      const token = query.token;
      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      const payload = verifyToken(token);
      if (!payload) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.userId = payload.id;
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    const userId = ws.userId;
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId).add(ws);

    ws.on('close', () => {
      const userConnections = clients.get(userId);
      if (userConnections) {
        userConnections.delete(ws);
        if (userConnections.size === 0) {
          clients.delete(userId);
        }
      }
    });
  });

  // Attach global dispatch hook in the same node runtime
  global.broadcastWSNotification = (notifications) => {
    for (const notif of notifications) {
      const userId = notif.userId;
      const userConnections = clients.get(userId);
      if (userConnections) {
        const payload = JSON.stringify({ type: 'notification', payload: notif });
        for (const ws of userConnections) {
          if (ws.readyState === 1) { // OPEN
            ws.send(payload);
          }
        }
      }
    }
  };

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
