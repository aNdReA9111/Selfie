import { Request, Response } from 'express';
import EventModel from '../models/eventModel.js';

const createEvent = async (req: Request, res: Response) => {
    const { titolo, descrizione, data, frequenza, ripetizioni, _id_utente } = req.body;

    try {
        const event = await EventModel.createEvent(titolo, descrizione, data, frequenza, ripetizioni, _id_utente);
        res.status(201).json(event);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const deleteEventById = async (req: Request, res: Response) => {
    const { _id } = req.body;

    try {
        const event = await EventModel.deleteEventById(_id);
        res.status(200).json(event);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export { createEvent, deleteEventById };
