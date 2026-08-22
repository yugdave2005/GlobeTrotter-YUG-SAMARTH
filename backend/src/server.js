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
