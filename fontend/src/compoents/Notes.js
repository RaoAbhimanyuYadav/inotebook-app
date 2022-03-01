import React, { useContext, useEffect, useState, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import { AddNote } from "./AddNote";
import { Noteitem } from "./Noteitem";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
  const { showAlert } = props;
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    } else {
      navigate("/login");
      showAlert("Login to access your Notes", "warning");
    }
    // eslint-disable-next-line
  }, []);

  //note variable
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "General" });

  //to update note
  const updateNote = (currentNote) => {
    ref.current.click(); //current find where is ref is pointing
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
  };

  //modal open using useref
  const ref = useRef(null);
  const refClose = useRef(null);
  //updating note
  const handleEdit = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Updated successfully", "success");
  };

  //...is a spread operator
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); //value in note obj remain same but the properties written next are either added or overwritten
  };
  return (
    <>
      <AddNote showAlert={showAlert} />
      {/* update note modal */}
      <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-2">
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Title
                  </label>
                  <input type="text" className="form-control" id="etitle" value={note.etitle} name="etitle" minLength={3} required aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input type="text" className="form-control" id="edescription" value={note.edescription} minLength={5} required name="edescription" onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input type="text" className="form-control" value={note.etag} id="etag" name="etag" onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" disabled={note.etitle.length < 3 || note.edescription.length < 5} onClick={handleEdit} className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h1>Your Notes</h1>
        <div className="container">{notes.length === 0 && "No Notes to Display"}</div>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} updateNote={updateNote} showAlert={showAlert} />;
        })}
      </div>
    </>
  );
};
