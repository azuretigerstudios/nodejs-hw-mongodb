import { Contact } from '../db/models/contact.model.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  // MongoDB'de yeni bir belge oluştur
  const newContact = await Contact.create(payload);
  return newContact;
};

// src/services/contacts.js

// ... (Diğer hizmet fonksiyonları)

export const deleteContact = async (contactId) => {
  // Belgeyi bulur ve siler. Silinen belgeyi döndürür (null eğer bulunamazsa).
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
  return deletedContact;
};