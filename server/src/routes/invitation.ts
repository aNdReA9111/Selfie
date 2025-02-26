import express from "express";
import {
    acceptActivityInvitation,
    acceptEventInvitation
} from "../controllers/invitationController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const invitationRoutes = express.Router();

invitationRoutes.use(requireAuth);

invitationRoutes.patch("/activity/:id", acceptActivityInvitation);
invitationRoutes.patch("/event/:id", acceptEventInvitation);

export { invitationRoutes };
