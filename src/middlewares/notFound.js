// src/middlewares/notFound.js

import createHttpError from 'http-errors';

/* export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
};
 */

const notFoundHandler = (req, res, next) => {
  // Eğer hiçbir rota eşleşmezse, 404 hatası oluştur.
  next(createHttpError(404, 'Route not found'));
};

export default notFoundHandler;