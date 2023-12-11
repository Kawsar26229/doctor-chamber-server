const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// Port
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.271e7ea.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // Service Collection
    const serviceCollection = client.db('doctorsChamber').collection('services')

    // Service Routes
    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find().toArray()
        res.send(result)
    })

    console.log('Connected to MongoDB with Doctors Chamber');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
// Call the function to establish the connection
connectToDB();

// Routes
app.get('/', (req, res) => {
    res.send('Doctors Chamber is running')
})

// Connection to the backend
app.listen(port, () => {
    console.log(`Doctors chamber is running on port ${port}`);
})
