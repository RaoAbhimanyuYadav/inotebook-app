const mongoose = require("mongoose");

const { Schema } = mongoose;

const NoteSchema = new Schema({
  //to associate notes to particular user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now, //function run when document insert in mongo (don't call function i.e. Date.now())
  },
});

module.exports = mongoose.model("note", NoteSchema);
//note is name of data collection
