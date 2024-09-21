import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

// configuro il .env
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  //verifico che un utente sia autenticato
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Richiesto token di autenticazione" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(
      token,
      process.env.SECRET as string,
    ) as JwtPayload;
    req.body.user = (await UserModel.findOne({ _id }).select("_id"))?._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Richiesto non autorizzata" });
  }
};

export { requireAuth };
