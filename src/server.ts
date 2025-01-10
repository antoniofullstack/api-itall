import dotenv from 'dotenv';
import { AppDataSource } from './config/ormconfig';
import { createApp } from './app';

dotenv.config();

const startServer = async () => {
  try {
    // Initialize TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    const app = await createApp();
    const PORT = process.env.PORT || 3333;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
