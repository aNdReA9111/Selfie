import nodeMailer from "nodemailer";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// configuro il .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const transporter = nodeMailer.createTransport({
  //Qui ci pensa Andre
});

