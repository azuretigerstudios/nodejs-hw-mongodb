// src/middlewares/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary/index.cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
        folder: 'contacts_photos', // Yüklenen dosyaların saklanacağı klasör
        allowed_formats: ['jpg', 'png', 'webp'],
        public_id: file.originalname.split('.')[0],
    };
  },
});

export const upload = multer({ storage });
