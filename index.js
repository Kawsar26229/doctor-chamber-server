const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// Port
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.271e7ea.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // Service Collection
    const serviceCollection = client
      .db("doctorsChamber")
      .collection("services");
    const bookingCollection = client
      .db("doctorsChamber")
      .collection("bookings");

    // Service Routes
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // Booking Routes
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });
    app.patch("/bookings/:id", async (req, res) => {
        const id = req.params.id
        const booking = req.body
        console.log(booking);
        const query = {_id: new ObjectId(id)}
        const updatedBooking = {
            $set: {
                status: booking.status
            }
        }
        const result = await bookingCollection.updateOne(query, updatedBooking)
        res.send(result)
    })
    app.delete("/bookings/:id", async (req, res) => {
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query)
        res.send(result)
    })

    console.log("Connected to MongoDB with Doctors Chamber");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
// Call the function to establish the connection
connectToDB();

// Routes
app.get("/", (req, res) => {
  res.send("Doctors Chamber is running");
});

// Connection to the backend
app.listen(port, () => {
  console.log(`Doctors chamber is running on port ${port}`);
});
