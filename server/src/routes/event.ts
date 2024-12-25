import express from "express";
import {
    createEvent,
    deleteAllEvents,
    deleteEventById,
    exportEvents,
    getAllEvents,
    getEventById,
    importEvents,
    updateEvent
} from "../controllers/eventControllers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const eventRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione di jwt token
eventRoutes.use(requireAuth);

/* controllers */

// event creation
eventRoutes.post("/", createEvent);
// events export into ics calendar
eventRoutes.get("/export-events", exportEvents);
// events import from ics calendar
eventRoutes.post("/import-events", importEvents);
// get specific event
eventRoutes.get("/:id", getEventById);
// get all events + filters
eventRoutes.get("/", getAllEvents);
// event deletion
eventRoutes.delete("/:id", deleteEventById);
// delete all events
eventRoutes.delete("/", deleteAllEvents);
// update specific event
eventRoutes.patch("/:id", updateEvent);

export { eventRoutes };
