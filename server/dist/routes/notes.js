import express from "express";
import { getNotes, getNote, addNote, updateNote, deleteNote, deleteAllNotes, } from "../controllers/notesControllers.js";
import { requireAuth } from '../middleware/requireAuth.js';
const notesRouter = express.Router();
notesRouter.use(requireAuth);
//ritorna le note visualizzabili dall'utente
notesRouter.get("/", getNotes);
//ritorna la singola nota
notesRouter.get("/:id", getNote);
//aggiunta di una nuova nota
notesRouter.post("/", addNote);
//modifica di una nota esistente
notesRouter.patch("/:id", updateNote);
//eliminazione di una nota
notesRouter.delete("/:id", deleteNote);
//eliminazione di tutte le note
notesRouter.delete("/", deleteAllNotes);
export { notesRouter };
//# sourceMappingURL=notes.js.map