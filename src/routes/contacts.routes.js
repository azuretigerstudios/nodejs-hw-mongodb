import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController
} from '../controllers/contacts.controller.js';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';

//export const contactsRouter = express.Router();

contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
//contactsRouter.post('/', createContactController);
contactsRouter.post('/', ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId', ctrlWrapper(updateContactController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

export default contactsRouter;