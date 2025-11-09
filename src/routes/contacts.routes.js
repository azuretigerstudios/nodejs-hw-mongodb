import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
} from '../controllers/contacts.controller.js';

export const contactsRouter = express.Router();

contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
