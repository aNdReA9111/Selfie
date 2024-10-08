import { Request, Response } from "express";
import { ActivityModel, IActivity } from "../models/activityModel.js";
import { UserModel, IUser } from "../models/userModel.js";
import mongoose from "mongoose";

const createActivity = async (req: Request, res: Response) => {
  const { title, description, date, endDate, isLate, user: userId } = req.body;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const activity: IActivity = await ActivityModel.create({
      title,
      description,
      date,
      endDate,
      isLate,
      _id_user: userId,
    });

    res.status(201).json(activity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getActivities = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const activities = await ActivityModel.find({ _id_user: userId.toString() });
    res.status(200).json(activities);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

const getActivityById = async (req: Request, res: Response) => {
  const activityId = req.params.id;
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ error: "Invalid Activity Id" });
  }

  try {
    const activity: IActivity | null = await ActivityModel.findOne({
      _id: new mongoose.Types.ObjectId(activityId),
      _id_user: userId.toString(),
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteActivityById = async (req: Request, res: Response) => {
  const activityId = req.params.id;
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ error: "Invalid Activity Id" });
  }

  try {
    const activity: IActivity | null = await ActivityModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(activityId),
      _id_user: userId.toString(),
    });
    res.status(200).json(activity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteActivities = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const result: mongoose.mongo.DeleteResult = await ActivityModel.deleteMany({
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

const updateActivity = async (req: Request, res: Response) => {
  const activityId = req.params.id;
  const userId: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ error: "Invalid Activity Id" });
  }

  try {
    const activity: IActivity | null = await ActivityModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(activityId), _id_user: userId.toString() },
      req.body
    );
    res.status(200).json(activity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export { createActivity, getActivities, getActivityById, deleteActivityById, deleteActivities, updateActivity };
