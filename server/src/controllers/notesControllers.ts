import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel, IUser } from "../models/userModel.js";
import { NoteModel, INote } from "../models/noteModel.js";

const addNote = async (req: Request, res: Response) => {
  const { user: _id, ...noteData } = req.body;

  const user: IUser | null = await UserModel.findOne({ _id });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.username !== noteData.author) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const newNote: INote = await NoteModel.create({ ...noteData });
    res.status(200).json(newNote);
  } catch (error: any) {
    return res.status(400).json({ error: "Invalid note data" });
  }
};

const getNotes = async (req: Request, res: Response) => {
  const _id: mongoose.Types.ObjectId = req.body.user;

  const user: IUser | null = await UserModel.findOne({ _id });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  //prendo quelle note che di proprietà dell'utente e quelle che sono accessibili da esso, ma non sue
  const notes: INote[] | null = await NoteModel.find({
    $or: [
      { author: user.username },
      { allowedUsers: { $in: [user.username] } },
    ],
  });

  if (notes === null) {
    return res.status(404).json({ error: "Impossibile to retrieve notes" });
  }

  res.status(200).json(notes);
};

const getNote = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = req.body.user;
  const noteId: string = req.params.id;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ error: "Invalid Note Id" });
  }

  //la nota deve avere l'ID nel parametro ed essere
  const note: INote | null = await NoteModel.findOne({
    _id: new mongoose.Types.ObjectId(noteId),
    $or: [
      { author: user.username },
      { allowedUsers: { $in: [user.username] } },
    ],
  });
  if (note === null) {
    return res.status(404).json({ error: "Impossibile to retrieve the note" });
  }

  res.status(200).json(note);
};

const updateNote = async (req: Request, res: Response) => {
  const { user: userId, ...noteData } = req.body;
  const noteId: string = req.params.id;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ error: "Invalid Note Id" });
  }

  const note: INote | null = await NoteModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(noteId),
      author: user.username, //tolgo la condizione della lista --> posso modificare solo le mie note
    },
    { ...noteData, updated: Date.now() },
    { new: true },
  );

  if (note === null) {
    return res
      .status(404)
      .json({ error: "Impossibile to retrieve and update the note" });
  }

  res.status(200).json(note);
};

const deleteNote = async (req: Request, res: Response) => {
  const { user: userId, ...noteData } = req.body;
  const noteId: string = req.params.id;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ error: "Invalid Note Id" });
  }

  const note: INote | null = await NoteModel.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(noteId),
    author: user.username, //tolgo la condizione della lista --> posso eliminare solo le mie note
  });

  if (note === null) {
    return res
      .status(404)
      .json({ error: "Impossibile to retrieve and delete the note" });
  }

  res.status(200).json(note);
};

const deleteAllNotes = async (req: Request, res: Response) => {
  const { user: userId } = req.body;

  const user: IUser | null = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const deleteResult: mongoose.mongo.DeleteResult = await NoteModel.deleteMany({
    author: user.username,
  });

  if (deleteResult.deletedCount === 0) {
    return res.status(404).json({ error: "Impossibile to delete all notes" });
  }

  return res.status(200);
};

export { addNote, getNotes, getNote, updateNote, deleteNote, deleteAllNotes };
