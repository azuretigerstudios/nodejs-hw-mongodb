// src/middlewares/validateBody.js

import createHttpError from 'http-errors';

const validateBody = (schema) => async (req, res, next) => {
  try {
    // req.body'yi Joi şemasına göre doğrular.
    // abortEarly: false, tüm hataları tek seferde toplar.
    await schema.validateAsync(req.body, { abortEarly: false });
    
    // Doğrulama başarılıysa bir sonraki adıma geç
    next();
  } catch (error) {
    // Joi doğrulama hatalarını yakalar
    if (error.name === 'ValidationError') {
      // Tüm hata mesajlarını birleştirir
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
        
      // 400 Bad Request hatası fırlatır
      next(createHttpError(400, errorMessage));
    } else {
      // Diğer hataları (500) iletir
      next(error);
    }
  }
};

export default validateBody;