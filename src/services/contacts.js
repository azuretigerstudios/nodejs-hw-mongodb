// src/services/contacts.js

import {Contact} from '../db/models/contact.model.js';

// ... (Diğer hizmet fonksiyonları)

export const createContact = async (payload) => {
  // MongoDB'de yeni bir belge oluştur
  const newContact = await Contact.create(payload);
  return newContact;
};