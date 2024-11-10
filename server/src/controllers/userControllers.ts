import { Request, Response } from "express";
import { UserModel, IFlags } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import webpush from "web-push";

// configuro il .env
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Req } from "../utils/types.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { EventModel } from "../models/eventModel.js";
import { IUser } from "../models/userModel.js";

const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn: "3d" });
};

// login user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);

    // creo il token
    const token = createToken(String(user._id));
    console.log(token);

    res.status(200).json({
      _id: user._id,
      email,
      token,
      nome: user.nome,
      cognome: user.cognome,
      username: user.username,
      data_nascita: user.data_nascita,
      flags: user.flags,
      pushSubscriptions: user.pushSubscriptions,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// signup user
const signUpUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    nome,
    cognome,
    username,
    data_nascita,
    notifica_alert,
    notifica_desktop,
    notifica_email,
  } = req.body;

  try {
    const flags = {
      notifica_email,
      notifica_desktop,
      notifica_alert,
    } as IFlags;

    const user = await UserModel.signup(
      email,
      password,
      nome,
      cognome,
      username,
      data_nascita,
      flags,
    );

    // creo il token
    const token = createToken(String(user._id));

    res.status(201).json({
      _id: user._id,
      email,
      token,
      nome: user.nome,
      cognome: user.cognome,
      username: user.username,
      data_nascita: user.data_nascita,
      flags: user.flags,
      pushSubscriptions: user.pushSubscriptions,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// funzione che riceve la subscription per push notifications e la aggiunge all'utente
const addSubscription = async (req: Req, res: Response) => {
  const { user: _id, subscription: sub } = req.body;
  console.log(_id, sub);
  const user = await UserModel.findOne({ _id: _id });
  if (!user) {
    console.log("User not found");
    return res.status(404).json({ message: "User not found" });
  }

  //notifica di conferma
  webpush.sendNotification(
    sub,
    JSON.stringify({ message: "Subscription added successfully" }),
  );

  user.pushSubscriptions.push(sub);
  await user.save();
  res.status(200).json({ message: "Subscription added successfully" });
};

// funzione che rimuove la subscription per push notifications
const removeSubscription = async (req: Req, res: Response) => {
  const { user: _id, subscription: sub } = req.body;
  const user = await UserModel.findOne({ _id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.pushSubscriptions = user.pushSubscriptions.filter((s) => s !== sub);
  await user.save();
  res.status(200).json({ message: "Subscription removed successfully" });
};

//qui andrà una route per invio di notifiche --> estensione 27 del pomodoro

const searchUsersByUsernameSubstring = async (req: Request, res: Response) => {
  const { substring } = req.body;

  try {
    const regex = new RegExp(`^${substring}`, "i"); // Ignora maiuscole e minuscole
    const users = await UserModel.find(
      { username: { $regex: regex } },
      { _id: 0, username: 1 },
    );

    const matchedUsernames = users.map((user: IUser) => user.username);

    res.status(200).json({ matchedUsernames });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export {
  loginUser,
  signUpUser,
  addSubscription,
  removeSubscription,
  searchUsersByUsernameSubstring,
};
