import express, { Router } from "express";
import { getOffset, setOffset } from "../controllers/timeMachineControllers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const timeMachineRoutes: Router = express.Router();

timeMachineRoutes.use(requireAuth);

//get offset for user
timeMachineRoutes.get("/", getOffset);

//set offset for user
timeMachineRoutes.put("/", setOffset);

export { timeMachineRoutes };
