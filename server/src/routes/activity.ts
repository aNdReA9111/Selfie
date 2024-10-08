import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createActivity,
  getActivities,
  getActivityById,
  deleteActivityById,
  deleteActivities,
  updateActivity,
} from "../controllers/activityControllers.js";

const activityRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione di jwt token
activityRoutes.use(requireAuth);

//creazione di un'attività
activityRoutes.post("/", createActivity);
//ritorna la singola attività
activityRoutes.get("/:id", getActivityById);
//ritorna tutti le attività o le attività filtrate
activityRoutes.get("/", getActivities);
//eliminazione della singola attività
activityRoutes.delete("/:id", deleteActivityById);
//eliminazione di tutte le attività
activityRoutes.delete("/", deleteActivities);
//aggiornamento di un'attività
activityRoutes.patch("/:id", updateActivity);

export { activityRoutes };
