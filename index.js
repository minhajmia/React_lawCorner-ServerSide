const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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
      const sort = { _id: -1 };
      const cursor = serviceReviewCollection.find(query).limit(3).sort(sort);
      const services = await cursor.toArray();
      res.send(services);
    });
    // get request for all items
    app.get("/services", async (req, res) => {
      const query = {};
      const sort = { _id: -1 };
      // const sort = sort({ _id: -1 });
      // const cursor = serviceReviewCollection.find(query).sort(sort);
      const cursor = serviceReviewCollection.find(query).sort(sort);
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
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get request for user own review
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const sort = { _id: -1 };
      const cursor = reviewCollection.find(query).sort(sort);
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete request for review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    // get request for specific review update;
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });
    // put request for update review
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateReview = req.body;
      const updateReviewInfo = {
        $set: {
          name: updateReview.name,
          rating: updateReview.rating,
          reviewInfo: updateReview.reviewInfo,
        },
      };
      const result = await reviewCollection.updateOne(
        filter,
        updateReviewInfo,
        options
      );
      res.send(result);
    });
    /// get request for review
    app.get("/userReviews", async (req, res) => {
      // console.log(req.query.id);
      let query = {};
      if (req.query.id) {
        query = {
          reviewId: req.query.id,
        };
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
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
