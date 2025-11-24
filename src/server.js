import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.routes.js';
import  notFound  from './middlewares/notFound.js';
import  errorHandler  from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  // 404
 app.use(notFound);

 app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
