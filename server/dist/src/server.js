import express from 'express';
import { userRoutes } from '../routes/user.js';
import mongoose from 'mongoose';
import cors from 'cors';
// Initialize the Express application
const app = express();
// Middleware per il parsing del corpo della richiesta in JSON
app.use(cors()); // Permetti CORS per tutte le rotte
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Routes
app.use('/api/users', userRoutes);
// Connessione al database
mongoose.connect("mongodb+srv://andrea:P9G3xICShr4H5dY9@cluster0.zvc2wry.mongodb.net/Selfie?retryWrites=true&w=majority&appName=Cluster0");
mongoose.connection.on("connected", () => console.log("Connesso a MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Riconnesso a MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnesso da MongoDB"));
mongoose.connection.on("error", (err) => console.error("Errore di connessione:", err));
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map