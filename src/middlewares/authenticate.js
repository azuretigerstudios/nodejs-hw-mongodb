// src/middlewares/authenticate.js

import createHttpError from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import Session from '../db/models/Session.js';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
    // 1. Authorization başlığını kontrol et
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(createHttpError(401, 'Authorization header missing'));
    }

    // 2. Token formatını kontrol et (Bearer token)
    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
        return next(createHttpError(401, 'Bearer token format is invalid'));
    }

    // 3. Session modelinde access token'ı ara
    const session = await Session.findOne({ accessToken });
    if (!session) {
        return next(createHttpError(401, 'Session not found'));
    }
    
    // 4. Access token süresinin dolup dolmadığını kontrol et
    if (new Date() > session.accessTokenValidUntil) {
        return next(createHttpError(401, 'Access token expired'));
    }

    // 5. User'ı bul ve req.user'a ekle
    const user = await User.findById(session.userId);
    if (!user) {
        return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
};

export default ctrlWrapper(authenticate); // Hata yakalama için ctrlWrapper kullanın