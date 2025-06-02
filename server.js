const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config(); // Optional: use this if testing locally with a .env file

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URI from Render environment variable
const uri = process.env.MONGO_URI;
const dbName = "sa";
const collectionName = "users";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Serve index.html explicitly at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to add a user
app.post('/add-user', async (req, res) => {
  const { name, email, age } = req.body;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({ name, email, age: parseInt(age) });
    console.log("Inserted:", result.insertedId);

    res.send("User added successfully.");
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Error adding user.");
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
