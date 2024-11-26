import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

// configuro il .env
import * as dotenv from "dotenv";
import { console } from "inspector";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    //verifico che un utente sia autenticato
    const token = req.cookies.token;

    if (!token)
        return res.status(401).json({ error: "Richiesto token di autenticazione" });

    try {
        const { _id } = jwt.verify(
            token,
            process.env.SECRET as string,
        ) as JwtPayload;
        req.body.user = (await UserModel.findOne({ _id }).select("_id"))?._id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Richiesta non autorizzata" });
    }
};

export { requireAuth };
