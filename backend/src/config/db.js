import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see the SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected via Sequelize');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default sequelize;
