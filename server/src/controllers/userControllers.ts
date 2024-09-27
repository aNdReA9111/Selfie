import { Request, Response } from 'express';
import { UserModel, IFlags } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// configuro il .env
import * as dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { EventModel } from '../models/eventModel.js';

const createToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn   : '3d' });
}

// login user
const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);

        // creo il token 
        const token = createToken(String(user._id)); 

        res.status(200).json({ _id: user._id, email, token, nome: user.nome, cognome: user.cognome, username: user.username, data_nascita: user.data_nascita, flags: user.flags });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}


// signup user
const signUpUser = async (req: Request, res: Response) => {
    const { email, password, nome, cognome, username, data_nascita, notifica_alert, notifica_desktop, notifica_email } = req.body;

    try {      
        const flags = {
            notifica_email,
            notifica_desktop,
            notifica_alert,
        } as IFlags;

        const user = await UserModel.signup(email, password, nome, cognome, username, data_nascita, flags);

        // creo il token 
        const token = createToken(String(user._id)); 

        // Creo un evento di compleanno per l'utente
        await EventModel.createEvent('Buon Compleanno', 'Auguri di buon compleanno!', user.data_nascita, ['annuale'], ['2s'], 'Europe/Rome', String(user._id));

        res.status(201).json({ _id: user._id, email, token, nome: user.nome, cognome: user.cognome, username: user.username, data_nascita: user.data_nascita, flags: user.flags });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export { loginUser, signUpUser };
