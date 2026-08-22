import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'monolith-backend' });
});

export default app;
