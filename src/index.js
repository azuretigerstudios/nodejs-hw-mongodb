import { config } from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

config();

const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp();
