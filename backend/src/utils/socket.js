import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Clients can join specific "rooms" based on the trip they are viewing
    socket.on('join_trip', (tripId) => {
      socket.join(tripId);
      console.log(`Client ${socket.id} joined trip ${tripId}`);
    });

    socket.on('leave_trip', (tripId) => {
      socket.leave(tripId);
      console.log(`Client ${socket.id} left trip ${tripId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
