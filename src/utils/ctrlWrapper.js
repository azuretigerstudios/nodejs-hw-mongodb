// src/utils/ctrlWrapper.js

const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      // Orijinal kontrolör fonksiyonunu çağır
      await ctrl(req, res, next);
    } catch (err) {
      // Bir hata oluşursa, errorHandler middleware'ine ilet
      next(err);
    }
  };
};

export default ctrlWrapper;