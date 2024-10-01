import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import  {    
    createEvent, 
    getAllEvents, 
    getEventById, 
    deleteEventById, 
    deleteAllEvents 
} from '../controllers/eventControllers.js';

const eventRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione di jwt token
eventRoutes.use(requireAuth);

/* controllers */

//post
eventRoutes.post('/', createEvent);

//get
eventRoutes.get('/:id_event', getEventById);
eventRoutes.get('/', getAllEvents);

//delete
eventRoutes.delete('/:id_event', deleteEventById);
eventRoutes.delete('/', deleteAllEvents);


export { eventRoutes };
