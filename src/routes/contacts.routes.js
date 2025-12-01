import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController
} from '../controllers/contacts.controller.js';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import authenticate from '../middlewares/authenticate.js';

const contactsRouter = express.Router();
contactsRouter.use(authenticate); // Tüm rotalar için kimlik doğrulama orta katmanını ekle

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
//contactsRouter.post('/', createContactController);
contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;