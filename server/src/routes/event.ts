import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import { createEvent, deleteEventById } from '../controllers/eventController.js';
const eventRoutes = express.Router();

eventRoutes.use(requireAuth);

// controllers
eventRoutes.post('/create', createEvent);
eventRoutes.delete('/delete/:id_user/:id_event', deleteEventById);


export { eventRoutes };