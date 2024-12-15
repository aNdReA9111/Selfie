import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import webpush from "web-push";
import { IFlags, UserModel } from "../models/userModel.js";
import { Req } from "../utils/types.js";

// configuro il .env
import * as dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn: "3d" });
};

// login controller
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(String(user._id));

        res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 giorni
            })
            .json({
                _id: user._id,
                email,
                token, // vedere se tenere o meno
                isAuthenticated: true,
                nome: user.nome,
                cognome: user.cognome,
                username: user.username,
                data_nascita: user.data_nascita,
                flags: user.flags,
                pushSubscriptions: user.pushSubscriptions,
                dateOffset: user.dateOffset,
            });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// signup controller
export const signUpUser = async (req: Request, res: Response) => {
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

        const token = createToken(String(user._id));
        res
            .status(201)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 giorni
            })
            .json({
                _id: user._id,
                email,
                token, // vedere se tenere o meno
                isAuthenticated: true,
                nome: user.nome,
                cognome: user.cognome,
                username: user.username,
                data_nascita: user.data_nascita,
                flags: user.flags,
                pushSubscriptions: user.pushSubscriptions,
                dateOffset: user.dateOffset,
            });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// funzione che riceve la subscription per push notifications e la aggiunge all'utente
export const addSubscription = async (req: Req, res: Response) => {
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
export const removeSubscription = async (req: Req, res: Response) => {
    const { user: _id, subscription: sub } = req.body;
    const user = await UserModel.findOne({ _id });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.pushSubscriptions = user.pushSubscriptions.filter((s) => s !== sub);
    await user.save();
    res.status(200).json({ message: "Subscription removed successfully" });
};

// search users
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { substring } = req.body;

        if (!substring) {
            return res.status(400).json({ error: "Substring required" });
        }

        const users = await UserModel.find({
            username: { $regex: substring, $options: "i" },
        }).select("username -_id");

        const matchedUsernames = users.map((user) => user.username);

        res.status(200).json({ matchedUsernames });
    } catch (error) {
        res.status(400).json({ error: "Error searching users" });
    }
};

// logout controller
export const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};
