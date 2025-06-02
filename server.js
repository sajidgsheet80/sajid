const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB config
const uri = "mongodb://127.0.0.1:27017";
const dbName = "sa";
const collectionName = "users";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve index.html

// POST route to add user
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
