import app from './app';
import { config } from './config/environment';
import { connectDB } from './config/database';
import { User } from './models/User';
import { runSeed } from './seeds/seed';

async function bootstrap() {
  try {
    await connectDB();

    // Check if initial users exist, if not run seed automatically
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Initializing default parish demo data...');
      await runSeed();
    }

    const server = app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`Catholic Forane Parish Management API Server Started`);
      console.log(`Port:        ${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(`API Base:    http://localhost:${config.port}/api/v1`);
      console.log(`Health:      http://localhost:${config.port}/api/health`);
      console.log(`=======================================================`);
    });

    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
