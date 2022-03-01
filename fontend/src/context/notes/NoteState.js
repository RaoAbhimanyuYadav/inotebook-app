import React, { useState } from "react";
import NoteContext from "./noteContext";

//created context fuction to use in compoenents
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  //Get all Note
  const getNotes = async () => {
    // api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  //Add a Note
  const addNote = async (title, description, tag) => {
    // api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();

    //logic

    setNotes(notes.concat(note)); //concat returns an array whereas push updates an array
  };
  //Delete a Note
  const deleteNote = async (id) => {
    // api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);

    //logic

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //api call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    //logic to edit in client
    //as we can't change state directly in react
    let newNotes = JSON.parse(JSON.stringify(notes));

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  //value = {{Values/function to be passed to components}}
  return <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>{props.children}</NoteContext.Provider>;
};

export default NoteState;
