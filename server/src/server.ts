// Inizializzo Express
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";

// Middleware
import cors from "cors";
import { corsOptions } from "./utils/corsOption.js";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { startDaemon } from "./workers/notificationDaemon.js";

// Routes
import { activityRoutes } from "./routes/activity.js";
import { emailRoutes } from "./routes/email.js";
import { eventRoutes } from "./routes/event.js";
import { messageRoutes } from "./routes/message.js";
import { notesRoutes } from "./routes/note.js";
import { timeMachineRoutes } from "./routes/timeMachine.js";
import { userRoutes } from "./routes/user.js";

const app = express();

// configuro il .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//path relativo a dist
dotenv.config({ path: path.resolve(__dirname, "../.env") });

//configurazione webpush
webpush.setVapidDetails(
    "mailto:leonardo.po@studio.unibo.it",
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
);

// Middleware per il parsing del corpo della richiesta in JSON
app.use(cors(corsOptions)); // Permetti CORS solo per determinate origini
app.use(express.json());
app.use(cookieParser());
//logging middleware
app.use((req: Request, res: Response, next: any) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next(); // Pass the request to the next middleware or router
});

app.use((req: Request, _: Response, next: any) => {
    console.log(req.body);
    next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/timeMachine", timeMachineRoutes);
app.use("/api/email", emailRoutes);

// Connessione al database
const PORT = Number(process.env.PORT as unknown) || 4000;
mongoose
    .connect(process.env.DB_URI as string)
    .then(() => {
        console.log("Connesso a MongoDB");
        startDaemon();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Errore di connessione:", err);
    });

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
