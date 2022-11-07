const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("server is running for assignment-11");
});
app.listen(port, () => {
  console.log("listening the port of  : ", port);
});
