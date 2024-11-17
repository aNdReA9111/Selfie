import nodemailer from 'nodemailer';

// configuro il .env
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


// Configurazione del trasporto con Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Funzione per inviare email
export const sendEmail = async (to: string, subject: string, text: string, attachments: any[]) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Errore nell’invio dell’email:', error);
  }
}
