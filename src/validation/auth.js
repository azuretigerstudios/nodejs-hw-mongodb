// src/validation/auth.js

import Joi from 'joi';

// Temel email/password şeması
const authSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'E-posta zorunludur.',
        'string.email': 'Geçerli bir e-posta adresi giriniz.',
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Şifre zorunludur.',
        'string.min': 'Şifre en az 6 karakter olmalıdır.',
    }),
});

export const registerSchema = authSchema.keys({
    name: Joi.string().min(3).required().messages({
        'any.required': 'İsim zorunludur.',
    }),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'E-posta zorunludur.',
  }),
});

// Yeni Şifre Belirleme Şeması
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Yeni şifre zorunludur.',
    'string.min': 'Şifre en az 6 karakter olmalıdır.',
  }),
});

export const loginSchema = authSchema;