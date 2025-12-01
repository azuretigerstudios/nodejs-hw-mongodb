// src/controllers/auth.js

import createHttpError from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

// Access token'ı cookie'ye kaydetmek için yardımcı fonksiyon
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Yalnızca sunucu tarafından erişilebilir
        secure: process.env.NODE_ENV === 'production', // HTTPS gerektirir (Render'da)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün (ms)
        sameSite: 'Lax',
    });
};

// 1. Kayıt Kontrolörü (Adım 3)
export const registerController = ctrlWrapper(async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
});

// 2. Giriş Kontrolörü (Adım 4)
export const loginController = ctrlWrapper(async (req, res) => {
    const session = await loginUser(req.body);

    // Refresh token'ı cookie'ye kaydet
    setRefreshTokenCookie(res, session.refreshToken);

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });
});

// 3. Oturum Yenileme Kontrolörü (Adım 5)
export const refreshController = ctrlWrapper(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        throw createHttpError(401, 'Refresh token not provided');
    }

    const newSession = await refreshSession(refreshToken);

    // Yeni refresh token'ı cookie'ye kaydet
    setRefreshTokenCookie(res, newSession.refreshToken);

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: newSession.accessToken,
        },
    });
});

// 4. Çıkış Kontrolörü (Adım 6)
export const logoutController = ctrlWrapper(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        // Zaten çıkış yapılmışsa 204 döndür
        return res.status(204).send();
    }

    await logoutUser(refreshToken);

    // Cookie'yi temizle
    res.clearCookie('refreshToken');

    res.status(204).send(); // 204 No Content
});