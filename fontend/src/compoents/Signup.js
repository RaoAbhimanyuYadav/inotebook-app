import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save auth token andRedirect
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Account created successfully", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  return (
    <div className="conatiner">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <h2>Sign Up to create account in iNotebook</h2>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input type="text" onChange={onChange} className="form-control" id="name" name="name" aria-describedby="emailHelp" minLength={3} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input type="email" onChange={onChange} className="form-control" id="email" name="email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input type="password" onChange={onChange} className="form-control" id="password" name="password" minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input type="password" onChange={onChange} className="form-control" id="cpassword" name="cpassword" />
        </div>

        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
