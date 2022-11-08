const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD_NAME}@cluster0.dftbcru.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceReviewCollection = client
      .db("ServiceReview")
      .collection("services");
    // get 3 items
    app.get("/limitedServices", async (req, res) => {
      const query = {};
      const cursor = serviceReviewCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    // get all items
    app.get("/Services", async (req, res) => {
      const query = {};
      const cursor = serviceReviewCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("server is running for service Review");
});
app.listen(port, () => {
  console.log("listening the port of  : ", port);
});
