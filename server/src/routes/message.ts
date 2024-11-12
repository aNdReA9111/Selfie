import express from 'express';
import { getMessages, sendMessage } from '../controllers/messagesController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const messageRoutes = express.Router();

messageRoutes.use(requireAuth);

messageRoutes.get('/get/:id', getMessages);
messageRoutes.post('/send/:sender_id', sendMessage);

export { messageRoutes };
