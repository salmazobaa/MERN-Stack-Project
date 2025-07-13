const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  // get notes from MongoDB
  const notes = await Note.find().lean();

  // if there aren't any notes

  if (!notes?.length) {
    return res.status(400).json({ message: "no notes found" });
  }
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { title, content, userId } = req.body;
  // Confirm data
  if (!title || !content || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, content } = req.body;
  // Confirm data
  if (!id || !title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Does the note exist to update?
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }
  const updateNote = await user.save();
  res.json({ message: "Note updated successfully" });
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Does the note exist to delete?
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const deletedNote = await user.deleteOne();

  const reply = `Note with id ${deletedNote._id} deleted successfully`;
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
