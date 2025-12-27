import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.routes.js';
import  notFound  from './middlewares/notFound.js';
import  errorHandler  from './middlewares/errorHandler.js';
import authRouter from './routes/auth.js';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  const swaggerDocPath = path.join(process.cwd(), 'docs', 'swagger.json');
  
  if (fs.existsSync(swaggerDocPath)) {
    const swaggerDoc = JSON.parse(fs.readFileSync(swaggerDocPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  }

   app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Contacts API!',
    });
  });

  app.use('/contacts', contactsRouter);


app.use('/auth', authRouter);

  // 404
 app.use(notFound);


 app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
