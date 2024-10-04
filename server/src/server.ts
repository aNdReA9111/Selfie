// Inizializzo Express
import express, { Request, Response } from "express";
const app = express();

// configuro il .env
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//path relativo a dist
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Middleware per il parsing del corpo della richiesta in JSON
import cors from "cors";
import { corsOptions } from "./utils/corsOption.js";
app.use(cors(corsOptions)); // Permetti CORS solo per determinate origini
app.use(express.json());
//logging middleware
app.use((req: Request, res: Response, next: any) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next(); // Pass the request to the next middleware or router
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Routes
import { userRoutes } from "./routes/user.js";
import { notesRoutes } from "./routes/notes.js";
import { eventRoutes } from './routes/event.js';
import { messageRoutes } from "./routes/message.js";

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use('/api/events', eventRoutes);
app.use("/api/messages", messageRoutes);


// Connessione al database
import mongoose from "mongoose";
mongoose.connect(process.env.DB_URI as string);
mongoose.connection.on("connected", () => console.log("Connesso a MongoDB"));
mongoose.connection.on("reconnected", () =>
  console.log("Riconnesso a MongoDB"),
);
mongoose.connection.on("disconnected", () =>
  console.log("Disconnesso da MongoDB"),
);
mongoose.connection.on("error", (err) =>
  console.error("Errore di connessione:", err),
);

// Start the server
const PORT = Number(process.env.PORT as unknown) || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
