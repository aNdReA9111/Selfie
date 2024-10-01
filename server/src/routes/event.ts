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

//creazione di un evento
eventRoutes.post('/', createEvent);
//ritorna il singolo evento
eventRoutes.get('/:id_event', getEventById);
//ritorna tutti gli eventi o gli eventi filtrati per data
eventRoutes.get('/', getAllEvents);
//eliminazione del singolo evento
eventRoutes.delete('/:id_event', deleteEventById);
//eliminazione di tutti gli eventi 
eventRoutes.delete('/', deleteAllEvents);
//patch
eventRoutes.patch('/:id_event')

export { eventRoutes };
