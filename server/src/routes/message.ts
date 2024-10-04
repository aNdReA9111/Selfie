import express, { Router } from "express";
import {
    getMessages, 
    sendMessage
} from "../controllers/messagesController.js";
import { requireAuth } from "../middleware/requireAuth.js";



const messageRoutes: Router = express.Router();
messageRoutes.use(requireAuth);

messageRoutes.get("/get", getMessages);
messageRoutes.post("/send/:username_sender", sendMessage);

export { messageRoutes };