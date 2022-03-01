const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

//if u want to use request.body then u need to use a middleware
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/note"));

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
