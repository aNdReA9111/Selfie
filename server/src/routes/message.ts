import express, { Router } from "express";
import {
    getMessages, 
    sendMessage
} from "../controllers/messagesController.js";
import { requireAuth } from "../middleware/requireAuth.js";



const messagesRoutes: Router = express.Router();
messagesRoutes.use(requireAuth);

messagesRoutes.get("/get", getMessages);
messagesRoutes.post("/send/:username_sender", sendMessage);

export default messagesRoutes;