const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

//ROUTE 1:get all the notes: GET "/api/auth/fetchallnotes". Login Required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 2:Add a new note using: POST "/api/auth/addnote". Login Required.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //decrypting
      const { title, description, tag } = req.body;

      //if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3:Update an existing note using: PUT "/api/auth/updatenote". Login Required.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //create new note
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }

    //find the note to be updated and update it
    // const note =Note.findByIdAndUpdate() not using this as user might be accessing other user note
    let note = await Note.findById(req.params.id);

    //if note not found
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //verifying same user
    if (note.user.toString() !== req.user.id) {
      //note.user.tostring() gives login user id
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true }); //new true ensureif any new contact come it will be added
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 4:Delete an existing note using: Delete "/api/auth/deletenote". Login Required.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted
    // const note =Note.findByIdAndUpdate() not using this as user might be accessing other user note
    let note = await Note.findById(req.params.id);

    //if note not found
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //verifying same user
    if (note.user.toString() !== req.user.id) {
      //note.user.tostring() gives login user id
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id); //new true ensureif any new contact come it will be added
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
