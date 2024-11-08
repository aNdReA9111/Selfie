import express from 'express';
import { getMessages, sendMessage } from '../controllers/messagesController.js';

const messageRoutes = express.Router();

messageRoutes.get('/get/:id', getMessages);
messageRoutes.post('/send/:sender_id', sendMessage);

export { messageRoutes };
