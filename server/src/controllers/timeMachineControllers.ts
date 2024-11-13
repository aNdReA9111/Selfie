import express, { Response } from "express";
import { Req } from "../utils/types.js";
import mongoose from "mongoose";
import { UserModel, IUser } from "../models/userModel.js";

export const setOffset = async (req: Req, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;
  const user: IUser | null = await UserModel.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const dateOffset = req.body.user;
  
  try {
    const user = await UserModel.findByIdAndUpdate(userId, {
      dateOffset
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message }); 
  }

  res.status(200).json({ dateOffset });
} 

export const getOffset = async (req: Req, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;
  const user: IUser | null = await UserModel.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const dateOffset = req.body.user;
  
  try {
    const user = await UserModel.findById(userId).select("dateOffset");
  } catch (error: any) {
    res.status(400).json({ message: error.message }); 
  }

  res.status(200).json({ dateOffset });
} 
