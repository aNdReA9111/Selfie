import { Request, Response } from 'express';
import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// configuro il .env
import * as dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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

        res.status(200).json({ email, token, nome: user.nome, cognome: user.cognome, username: user.username, data_nascita: user.data_nascita });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}


// signup user
const signUpUser = async (req: Request, res: Response) => {
    const { email, password, nome, cognome, username, data_nascita } = req.body;

    try {      
        const user = await UserModel.signup(email, password, nome, cognome, username, data_nascita);

        // creo il token 
        const token = createToken(String(user._id)); 

        res.status(201).json({ email, token, nome, cognome, username, data_nascita });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export { loginUser, signUpUser };
