import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import and use routes here
// import authRoutes from './routes/authRoutes.js';
// app.use('/api/auth', authRoutes);

export default app;
