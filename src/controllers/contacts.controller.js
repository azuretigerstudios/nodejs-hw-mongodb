import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.service.js';
/* import { createContact } from '../services/contacts.service.js';
import { deleteContact } from '../services/contacts.service.js'; */
//import { updateContact } from '../services/contacts.service.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

export const getAllContactsController = ctrlWrapper(async (req, res) => {

    const contacts = await contactsService.getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });

});

export const getContactByIdController = async (req, res, next) => {
  
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  
};



export const createContactController = ctrlWrapper(async (req, res) => {
  const contact = await contactsService.createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

// src/controllers/contacts.js

export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.deleteContact(contactId);

  // İletişim bulunamazsa 404 hatası oluşturun
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // Başarılı silme için 204 durumu ve gövde yok
  res.status(204).send();
});

export const updateContactController = ctrlWrapper(async (req, res) => {

    const { contactId } = req.params;
    const contact = await contactsService.updateContact(contactId, req.body); 
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: contact,
    });
    
    });