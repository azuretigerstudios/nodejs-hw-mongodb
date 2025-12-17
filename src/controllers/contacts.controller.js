import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.service.js';
/* import { createContact } from '../services/contacts.service.js';
import { deleteContact } from '../services/contacts.service.js'; */
//import { updateContact } from '../services/contacts.service.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getAllContactsSchema} from '../validation/contacts.js';

export const getAllContactsController = ctrlWrapper(async (req, res) => {

   // 1. Sorgu parametrelerini doğrula ve varsayılan değerleri al
  const { value: query, error } = getAllContactsSchema.validate(req.query);

  if (error) {
    // Joi doğrulama hatası fırlat
    throw createHttpError(400, `Geçersiz sorgu parametreleri: ${error.details[0].message}`);
  }

  // 2. Hizmetten tüm sorgu parametrelerini ileterek veriyi al
  const paginationData = await contactsService.getAllContacts(query);

  // 3. Yanıtı beklenen formatta gönder
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginationData, // Hizmetten gelen tüm sayfalandırma/sıralama/filtreleme verisini içerir
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



export const createContactController = async (req, res) => {
  const contactData = { ...req.body };

  // Eğer dosya yüklendiyse, Cloudinary URL'sini ekle
  if (req.file) {
    contactData.photo = req.file.path;
  }

  const contact = await contactsService.createContact({
    ...contactData,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

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

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    updateData.photo = req.file.path;
  }

  const result = await contactsService.updateContact(
    contactId,
    req.user._id,
    updateData,
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};