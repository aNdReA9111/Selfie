import express, { Request, Response } from "express";
import { sendEmail } from "../utils/emailUtils.js";
import { requireAuth } from "../middleware/requireAuth.js";
// import { EventModel } from "../models/eventModel.js";
// import { UserModel } from "../models/userModel.js";
// import { createICalendar } from "../utils/icalendarUtils.js";

const emailRoutes = express.Router();

emailRoutes.use(requireAuth);

//invia email
emailRoutes.post('/send-email', async (req: Request, res: Response) => {
  const { to, subject, text, attachments } = req.body;

  try {
    await sendEmail(to, subject, text, attachments);
    res.status(200).json({ message: 'Email inviata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell’invio dell’email', error });
  }
});

// emailRoutes.post('/send-icalendar', async (req: Request, res: Response) => {
//   const { userId } = req.body;
  
//   // Validazione dell'ID utente
//   if (!userId) {
//     return res.status(400).json({ message: 'ID utente non valido' });
//   }

//   try {
//     // Trova l'utente e verifica che esista
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Utente non trovato' });
//     }

//     // Trova gli eventi dell'utente
//     const events = await EventModel.find({ _id_user: userId });
//     if (!events || events.length === 0) {
//       return res.status(404).json({ message: 'Nessun evento trovato per questo utente' });
//     }

//     // Crea il calendario e invia l'email
//     const icalendar = createICalendar(events);
//     await sendEmail(user.email, 'Calendario Eventi', 'In allegato trovi il tuo calendario eventi.', [
//       { 
//         filename: 'calendario.ics', 
//         content: icalendar, 
//         contentType: 'text/calendar' 
//       }
//     ]);

//     res.status(200).json({ message: 'Calendario inviato con successo' });

//   } catch (error) {
//     console.error('Errore nell\'invio del calendario:', error);
//     res.status(500).json({ 
//       message: 'Errore nell\'invio del calendario', 
//       error: error instanceof Error ? error.message : 'Errore sconosciuto'
//     });
//   }
// });
export { emailRoutes };