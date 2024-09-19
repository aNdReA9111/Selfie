// Inizializzo Express
import express from 'express';
const app = express();
// configuro il .env
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Middleware per il parsing del corpo della richiesta in JSON
import cors from 'cors';
import { corsOptions } from '../utils/corsOption.js';
app.use(cors(corsOptions)); // Permetti CORS solo per determinate origini
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Routes
import { userRoutes } from '../routes/user.js';
import { eventRoutes } from '../routes/event.js';
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
// Connessione al database
import mongoose from 'mongoose';
mongoose.connect(process.env.DB_URI);
mongoose.connection.on("connected", () => console.log("Connesso a MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Riconnesso a MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnesso da MongoDB"));
mongoose.connection.on("error", (err) => console.error("Errore di connessione:", err));
// Start the server
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map