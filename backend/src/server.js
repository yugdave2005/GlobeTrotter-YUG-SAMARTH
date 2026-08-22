import dotenv from 'dotenv';
import sequelize, { connectDB } from './config/db.js';
import app from './app.js';

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

// Sync database models (optional but good for development)
await sequelize.sync();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
