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

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { title, content, user } = req.body;
  // Confirm data
  if (!title || !content || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // if duplicate
  const duplicateNote = await Note.findOne({ title }).lean().exec();
  if (duplicateNote) {
    return res.status(400).json({ message: "Note already exists" });
  }
  const note = await Note.create({ user, title, content });
  if (note) {
    return res.status(201).json({ message: "Note created successfully" });
  } else {
    return res.status(400).json({ message: "Failed to create note" });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, content, user, completed } = req.body;
  // Confirm data
  if (!id || !title || !content || !user || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Does the note exist to update?
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }
  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.title = title;
  note.content = content;
  note.user = user;
  note.completed = completed;

  const updatedNote = await Note.save();
  res.json(`'${updatedNote.title}' updated`)

});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }
  // Does the note exist to delete?
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const deletedNote = await Note.deleteOne();

  const reply = `Note with title ${deletedNote.title} deleted successfully`;

  res.json(reply);
  
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
