// src/middlewares/isValidId.js

import createHttpError from 'http-errors';
import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  // Rota parametrelerinden ID'yi alın
  const { contactId } = req.params;

  // ID'nin Mongoose tarafından geçerli bir ObjectId formatında olup olmadığını kontrol edin
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    // Geçersiz format ise 400 hatası fırlatılır
    next(createHttpError(400, `ID'si "${contactId}" olan iletişim için geçersiz format.`));
  } else {
    // Geçerliyse devam et
    next();
  }
};

export default isValidId;