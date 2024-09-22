import { Request, Response } from 'express';
import EventModel from '../models/eventModel.js';
import mongoose from 'mongoose';

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
    const { id_user, id_event} = req.params;

    try {
        const event = await EventModel.deleteEventById(String(id_event), String(id_user));
        res.status(200).json(event);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const deleteAllEvents = async (req: Request, res: Response) => {
    const { id_user } = req.params;

    try {
        await EventModel.deleteAllEvents(String(id_user));
        

        res.status(200).json({ message: 'All events deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export { createEvent, deleteEventById, deleteAllEvents };
