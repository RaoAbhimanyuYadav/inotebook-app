import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

export const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "General" });

  const handleAdd = (e) => {
    e.preventDefault(); //so that page don't reload
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" }); //to clear the typing area in client side
    props.showAlert("Added successfully", "success");
  };
  //...is a spread operator
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); //value in note obj remain same but the properties written next are either added or overwritten
  };
  return (
    <div>
      <div className="container my-3">
        <h2>Add a Note</h2>
        <form className="my-2">
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Title
            </label>
            <input type="text" className="form-control" minLength={3} required id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input type="text" className="form-control" id="description" name="description" onChange={onChange} value={note.description} minLength={5} required />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange} />
          </div>

          <button type="submit" disabled={note.title.length < 3 || note.description.length < 5} onClick={handleAdd} className="btn btn-primary">
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};
