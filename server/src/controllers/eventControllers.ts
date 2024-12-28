import { Response } from "express";
import mongoose from "mongoose";
import pkg from "rrule";
import { ActivityModel, IActivity } from "../models/activityModel.js";
import { EventModel, IEvent } from "../models/eventModel.js";
import { IUser, UserModel } from "../models/userModel.js";
import { ImportedCalendar, Req } from "../utils/types.js";

const { RRule } = pkg;

import { createICalendar, readICalendar } from "../utils/icalendarUtils.js";

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
        updatePastPomodoro(userId.toString(), user.email, user.dateOffset);

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
                                date: {
                                    $lte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                                },
                                endDate: {
                                    $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                                }
                            },
                            {
                                isRecurring: true
                            }
                        ],
                    },
                ],
            });

            events = events.filter((e: IEvent) => {
                if (e.isRecurring) {
                    const rrule: pkg.RRule = RRule.fromString(e.recurrenceRule);
                    const occurrences: Date[] = rrule.between(new Date(new Date(date).setHours(0, 0, 0, 0)), new Date(new Date(date).setHours(23, 59, 59, 999)), true);
                    console.log(occurrences.length);
                    return occurrences.length > 0;
                } else
                    return true;
            });
        }

        
        res.status(200).json(events);
    } catch (error: any) {
        console.log(error);
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

const exportEvents = async (req: Req, res: Response) => {
    const userId = req.body.user;

    /* id validation */
    if (!userId) {
        return res.status(400).json({ error: "Invalid User Id" });
    }

    try {
        /* user id check */
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        /* retrieving events and activities */
        const events: IEvent[] = await EventModel.find({ _id_user: userId });
        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found for this user" });
        }

        const activities: IActivity[] = await ActivityModel.find({ _id_user: userId });
        if (!activities || activities.length === 0) {
            return res.status(404).json({ error: "No activities found for this user" });
        }

        /* ics calendar generation */
        const icalendarContent = createICalendar(events, activities);

        /* setting headers to allow file download*/
        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', 'attachment; filename=calendario.ics');

        res.send(icalendarContent);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const importEvents = async (req: Req, res: Response) => {
    const { icalData } = req.body;
    const userId = req.body.user;

    /* id validation */
    if (!userId) {
        return res.status(400).json({ error: "Invalid User Id" });
    }


    if (!icalData) {
        return res.status(400).json({ error: "Missing ics data" });
    }

    try {
        const calendar: ImportedCalendar = await readICalendar(icalData, userId);

        res.status(200).json(calendar);

    } catch (error: any) {
        res.status(400).json({
            error: "Error happened while importing calendar",
            details: error.message
        });
    }
};

export {
    createEvent, deleteAllEvents, deleteEventById, exportEvents, getAllEvents,
    getEventById, importEvents, updateEvent
};

