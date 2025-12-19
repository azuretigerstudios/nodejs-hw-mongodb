// src/routes/auth.js

import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';

import { registerSchema, loginSchema } from '../validation/auth.js';
import { 
    registerController, 
    loginController, 
    refreshController, 
    logoutController 
} from '../controllers/auth.js';

const authRouter = express.Router();

// Adım 3: Kayıt
authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));

// Adım 4: Giriş
authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

// Adım 5: Yenileme
authRouter.post('/refresh', ctrlWrapper(refreshController));

// Adım 6: Çıkış
authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email', 
  validateBody(sendResetEmailSchema), 
  ctrlWrapper(sendResetEmailController)
);

export default authRouter;