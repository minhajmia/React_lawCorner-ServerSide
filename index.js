const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollection = client.db("ServiceReview").collection("reviews");
    // get request for  3 items
    app.get("/limitedServices", async (req, res) => {
      const query = {};
      const cursor = serviceReviewCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    // get request for all items
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceReviewCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // post api request for services
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceReviewCollection.insertOne(service);
      res.send(result);
    });
    // get request for single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceReviewCollection.findOne(query);
      res.send(result);
    });
    // post request for review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get request for user own review
    app.get("/reviews", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // delete request for review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { reviewId: id };
      const result = await reviewCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    // get request for specific review update;
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { reviewId: id };
      const result = await reviewCollection.findOne(query);
      console.log(result);
      res.send(result);
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
