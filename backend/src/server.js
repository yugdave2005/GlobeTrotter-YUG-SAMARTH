import app from './app.js';
import dotenv from 'dotenv';
import http from 'http';
import { initSocket } from './utils/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Backend server (with WebSockets) running on port ${PORT}`);
});

// Graceful shutdown on process exit or reload
const shutdown = (signal) => {
  if (server) {
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    server.close(() => {
      if (signal === 'SIGUSR2') {
        process.kill(process.pid, 'SIGUSR2');
      } else {
        process.exit(0);
      }
    });

    // Fallback emergency exit
    setTimeout(() => {
      process.exit(0);
    }, 400).unref();
  }
};

process.once('SIGUSR2', () => shutdown('SIGUSR2'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

