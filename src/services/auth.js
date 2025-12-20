// src/services/auth.js

import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/Session.js';
import { sendEmail } from '../utils/sendMail.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 dakika (ms)
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 gün (ms)

// Token ve geçerlilik sürelerini hesaplayan yardımcı fonksiyon
const createSessionTokens = (userId) => {
    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');
    
    const now = Date.now();
    const accessTokenValidUntil = new Date(now + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(now + REFRESH_TOKEN_LIFETIME);

    return {
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    };
};

// 1. Kayıt Hizmeti (Adım 3)
export const registerUser = async (payload) => {
    const { email, password } = payload;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw createHttpError(409, 'Email in use'); // 409 Conflict
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
        ...payload,
        password: hashedPassword,
    });

    // Şifreyi yanıt verilerinden kaldır
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
};

// 2. Giriş Hizmeti (Adım 4)
export const loginUser = async (payload) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password is wrong');
    }

    // Şifre kontrolü
    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
        throw createHttpError(401, 'Email or password is wrong');
    }

    // Kullanıcı için mevcut oturumu sil (Eski oturumu silme)
    await Session.deleteOne({ userId: user._id });

    // Yeni oturum oluştur
    const sessionData = createSessionTokens(user._id);
    const newSession = await Session.create(sessionData);

    return newSession;
};

// 3. Oturumu Yenileme Hizmeti (Adım 5)
export const refreshSession = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });
    
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    // Refresh token süresinin dolup dolmadığını kontrol et
    if (new Date() > session.refreshTokenValidUntil) {
        // Süresi dolan oturumu sil
        await Session.deleteOne({ _id: session._id });
        throw createHttpError(401, 'Refresh token expired');
    }

    // Eski oturumu sil
    await Session.deleteOne({ _id: session._id });

    // Yeni oturum oluştur
    const newSessionData = createSessionTokens(session.userId);
    const newSession = await Session.create(newSessionData);
    
    return newSession;
};

// 4. Çıkış Hizmeti (Adım 6)
export const logoutUser = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });
    
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }
    
    // Oturumu sil
    await Session.deleteOne({ _id: session._id });
};

// ... (register, login, logout fonksiyonları)

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // 5 dakikalık JWT Token oluşturma
  const token = jwt.sign(
    { email }, 
    process.env.JWT_SECRET, 
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<h1>Password Reset</h1><p>To reset your password, please click the link below:</p><a href="${resetLink}">${resetLink}</a>`
    });
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (token, password) => {
  let entries;
  try {
    entries = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: entries.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  // Kullanıcının mevcut tüm oturumlarını sil (Güvenlik için)
  await Session.deleteMany({ userId: user._id });
};