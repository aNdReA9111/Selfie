import express, { Request, Response } from "express";
import { sendEmail } from "../utils/emailUtils.js";
import { requireAuth } from "../middleware/requireAuth.js";

const emailRoutes = express.Router();

//invia email
emailRoutes.post('/send-email', requireAuth, async (req: Request, res: Response) => {
    const { to, subject, text } = req.body;
  
    try {
      await sendEmail(to, subject, text);
      res.status(200).json({ message: 'Email inviata con successo' });
    } catch (error) {
      res.status(500).json({ message: 'Errore nell’invio dell’email', error });
    }
  });

export { emailRoutes };