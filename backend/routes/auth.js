const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SCERET = "RaoSahab";

//ROUTE 1:Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "Minimum length of name i 3").isLength({ min: 3 }), //body(name,message on error)or body(name)
    body("email").isEmail(),
    body("password", "Minimum length of password i 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //check whether the user with this email exits already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Sorry user with this email already exits" });
      }

      //encrypting password into hashes
      const salt = await bcrypt.genSalt(10);
      securePass = await bcrypt.hash(req.body.password, salt);

      // creating mongoose model user
      //return promise
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      //created data object
      const data = {
        user: {
          id: user.id,
        },
      };

      //creating authtoken named jason web token signed with sceret(JWT_SCERET) to ensure payload data is not changed
      //It is used for client and server secure communication
      const authtoken = jwt.sign(data, JWT_SCERET);
      // console.log(authtoken);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 2:Authenticatr a User using: POST "/api/auth/login".
router.post("/login", [body("email", "Enter a valid email").isEmail(), body("password", "Password cannot be blank").exists()], async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  //destructuring email and password from body
  const { email, password } = req.body;

  try {
    //pulling user from database
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    //password compare
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    //sending payload data i.e. user data which we will send
    const payload = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(payload, JWT_SCERET);
    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 3:get logged in user details: POST "/api/auth/getuser". Login Required.
router.post(
  "/getuser",
  fetchuser, //middleware for id from token and next will call async(req,res)
  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password"); //select everything except password
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
