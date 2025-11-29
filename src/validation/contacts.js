// src/validation/contacts.js

import Joi from 'joi';

// String alanlar için tekrar eden min/max kurallarını tanımlayalım
const stringSchema = Joi.string().min(3).max(20);
const emailSchema = Joi.string().email().min(3).max(50); 

// 1. Yeni İletişim Oluşturma Şeması (POST)
export const createContactSchema = Joi.object({
  // Zorunlu ve min/max kısıtlamalı
  name: stringSchema.required().messages({
    'string.empty': 'İsim alanı boş bırakılamaz.',
    'any.required': 'İsim alanı zorunludur.',
  }),
  // Zorunlu ve min/max kısıtlamalı
  phoneNumber: stringSchema.required().messages({
    'string.empty': 'Telefon numarası boş bırakılamaz.',
    'any.required': 'Telefon numarası zorunludur.',
  }),
  
  // Opsiyonel
  email: emailSchema.optional().allow(null), 
  isFavourite: Joi.boolean().optional(),
  
  // Zorunlu ve enum kısıtlamalı
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'İletişim türü zorunludur.',
      'any.only': 'İletişim türü "work", "home" veya "personal" olmalıdır.',
    }),
});

// 2. İletişim Güncelleme Şeması (PATCH)
export const updateContactSchema = Joi.object({
  name: stringSchema.optional(),
  phoneNumber: stringSchema.optional(),
  email: emailSchema.optional().allow(null),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional(),
})
.min(1) // PATCH için en az bir alan gönderilmelidir
.messages({
    'object.min': 'Güncelleme için istek gövdesinde en az bir alan bulunmalıdır.',
});

export const getAllContactsSchema = Joi.object({
  // Geçerli sayfa numarası (1 veya daha büyük)
  page: Joi.number().min(1).default(1),
  perPage:  Joi.number().min(1).default(10),


    // Sıralama (Adım 4)
  sortBy: Joi.string().valid('name', 'createdAt').default('name'), 
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'), // Varsayılan 'asc'
  
  // Filtreleme (Adım 5)
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
  // isFavourite için sorgu parametresi, boole olarak değerlendirilmeli
  isFavourite: Joi.boolean().optional(),
});