import { Request, Response } from "express";
import { EventModel } from "../models/eventModel.js";
import mongoose from "mongoose";

const createEvent = async (req: Request, res: Response) => {
  const {
    titolo,
    descrizione,
    data,
    frequenza,
    ripetizioni,
    durata,
    timezone,
    user: _id,
  } = req.body;

  try {
    const event = await EventModel.createEvent(
      titolo,
      descrizione,
      data,
      frequenza,
      ripetizioni,
      durata,
      timezone,
      String(_id),
    );
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getEventById = async (req: Request, res: Response) => {
  const { id_event } = req.params;
  const _id: mongoose.Types.ObjectId = req.body.user;

  try {
    const event = await EventModel.getEventById(String(id_event), String(_id));
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  const _id: mongoose.Types.ObjectId = req.body.user;
  const { date } = req.query;

  try {
    let dateOb;
    if(typeof date === 'string')
      dateOb = new Date(date);
    else 
      dateOb = undefined;
    const events = await EventModel.getAllEvents(String(_id), dateOb);
    res.status(200).json(events);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEventById = async (req: Request, res: Response) => {
  const { id_event } = req.params;
  const _id: mongoose.Types.ObjectId = req.body.user;

  try {
    const event = await EventModel.deleteEventById(
      String(id_event),
      String(_id),
    );
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAllEvents = async (req: Request, res: Response) => {
  const _id: mongoose.Types.ObjectId = req.body.user;

  try {
    await EventModel.deleteAllEvents(String(_id));
    res.status(200).json({ message: "All events deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
  deleteAllEvents,
};
