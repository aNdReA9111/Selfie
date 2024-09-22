import express, { Router } from "express";
import {
  getNotes,
  getNote,
  addNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
} from "../controllers/notesControllers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const notesRoutes: Router = express.Router();

notesRoutes.use(requireAuth);

//ritorna le note visualizzabili dall'utente
notesRoutes.get("/", getNotes);
//ritorna la singola nota
notesRoutes.get("/:id", getNote);
//aggiunta di una nuova nota
notesRoutes.post("/", addNote);
//modifica di una nota esistente
notesRoutes.patch("/:id", updateNote);
//eliminazione di una nota
notesRoutes.delete("/:id", deleteNote);
//eliminazione di tutte le note
notesRoutes.delete("/", deleteAllNotes);

export { notesRoutes };
