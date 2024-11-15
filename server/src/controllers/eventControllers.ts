import { Response } from "express";
import { Req } from "../utils/types.js";
import { EventModel, IEvent } from "../models/eventModel.js";
import { UserModel, IUser } from "../models/userModel.js";
import mongoose from "mongoose";

const createEvent = async (req: Req, res: Response) => {
  const {
    title,
    description,
    date,
    endDate,
    location,
    url,
    duration,
    recurrenceRule,
    attendees,
    notifications,
    isRecurring,
    timezone,
    user: userId,
    isPomodoro,
    pomodoroSetting,
  } = req.body;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const event: IEvent = await EventModel.create({
      title,
      description,
      date,
      endDate,
      location,
      url,
      duration,
      isRecurring,
      recurrenceRule,
      attendees,
      notifications,
      timezone,
      _id_user: userId,
      isPomodoro,
      pomodoroSetting,
    });

    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getEventById = async (req: Req, res: Response) => {
  const eventId = req.params.id;
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event Id" });
  }

  try {
    const event: IEvent | null = await EventModel.findOne({
      _id: new mongoose.Types.ObjectId(eventId),
      $or: [
        { _id_user: userId.toString() },
        {
          attendees: {
            $elemMatch: {
              email: user.email,
              accepted: true,
            },
          },
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEvents = async (req: Req, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;
  const date = req.query.date;
  const onlyRecurring = /^true$/i.test(req.query.onlyRecurring as string);

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }


  try {
    let events: IEvent[];
    if (typeof date !== "string") {
      if (onlyRecurring) {
        events = await EventModel.find({
          isRecurring: onlyRecurring,
        });
      } else {
        events = await EventModel.find({
          $or: [
            { _id_user: userId.toString() },
            {
              attendees: {
                $elemMatch: {
                  email: user.email,
                  accepted: true,
                },
              },
            },
          ],
        });
      }
    } else {
      //query di eventi in una certa data, NON fa query di eventi ricorrenti
      events = await EventModel.find({
        $and: [
          {
            $or: [
              { _id_user: userId.toString() },
              {
                attendees: {
                  $elemMatch: {
                    email: user.email,
                    accepted: true,
                  },
                },
              },
            ],
          },
          {
            $or: [
              //eventi nella data
              {
                date: {
                  //ignoro ore, minuti, s e ms delle ore
                  $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                  $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
                },
              },
              //eventi in date precedenti la cui durata li fa arrivare fino alla data della query
              {
                $expr: {
                  $gte: [
                    { $add: ["$date", "$duration"] },
                    new Date(new Date(date).setHours(0, 0, 0, 0)),
                  ],
                },
              },
            ],
          },
        ],
      });
    }

    res.status(200).json(events);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEventById = async (req: Req, res: Response) => {
  const eventId = req.params.id;
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event Id" });
  }

  try {
    const event = await EventModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(eventId),
      _id_user: userId.toString(),
    });
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAllEvents = async (req: Req, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const result: mongoose.mongo.DeleteResult = await EventModel.deleteMany({
      _id_user: userId.toString(),
    });

    if (result.deletedCount === 0) {
      throw new Error("Impossibile to delete all events");
    }

    res.status(200).json({ message: "All events deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const updateEvent = async (req: Req, res: Response) => {
  const eventId = req.params.id;
  const { user: userId, ...eventData } = req.body;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event Id" });
  }

  try {
    //update evento
    const newEvent: IEvent | null = await EventModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(eventId),
        _id_user: userId,
      },
      { ...eventData },
      { new: true },
    );

    res.status(200).json(newEvent);
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
  updateEvent,
};
