//Created miidleware to fetch id from JWT Token
//middleware is a function which get called when login requied routes get a request

const jwt = require("jsonwebtoken");

const JWT_SCERET = "RaoSahab";

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  const token = req.header('auth-token');//token fetched from header and header name is auth-token

  //if token is not present
  if (!token) {
    res.status(401).send({ error: "Please authenticate usng valid token" });
  }


  try {
    //decrpting token and storing in data  and verifying token
    const data = jwt.verify(token, JWT_SCERET);
    req.user = data.user;//we will get user
    next();//it will call next middleware
  } catch (error) {//if token is not correct
    res.status(401).send({ error: "Please authenticate usng valid token" });
  }

};

module.exports = fetchuser;
