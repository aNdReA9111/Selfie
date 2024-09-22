import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import  {    
            createEvent, 
            getAllEvents, 
            getEventById, 
            deleteEventById, 
            deleteAllEvents 
        } from '../controllers/eventController.js';

const eventRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione di jwt token
eventRoutes.use(requireAuth);

/* controllers */

//post
eventRoutes.post('/create', createEvent);

//get
eventRoutes.get('/get/:id_user/:id_event', getEventById);
eventRoutes.get('/get/:id_user', getAllEvents);

//delete
eventRoutes.delete('/delete/:id_user/:id_event', deleteEventById);
eventRoutes.delete('/delete/:id_user', deleteAllEvents);


export { eventRoutes };