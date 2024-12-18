import express from "express";
import {
    createEvent,
    deleteAllEvents,
    deleteEventById,
    exportEvents,
    getAllEvents,
    getEventById,
    updateEvent
} from "../controllers/eventControllers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const eventRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione di jwt token
eventRoutes.use(requireAuth);

/* controllers */

//creazione di un evento
eventRoutes.post("/", createEvent);
// esporto eventi tramite iCal
eventRoutes.get("/export-events", exportEvents);
//ritorna il singolo evento
eventRoutes.get("/:id", getEventById);
//ritorna tutti gli eventi o gli eventi filtrati per data
eventRoutes.get("/", getAllEvents);
//eliminazione del singolo evento
eventRoutes.delete("/:id", deleteEventById);
//eliminazione di tutti gli eventi
eventRoutes.delete("/", deleteAllEvents);
//aggiornamento di un evento
eventRoutes.patch("/:id", updateEvent);

export { eventRoutes };
