const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const bodyParser = require("body-parser");
const { response } = require("express");
const mongo = require("./mongo.js");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5000",
  })
);
app.use(
  basicAuth({
    users: {
      jacques: "MyManJackyBoy",
    },
  })
);

/**
  START
  SHELTER APIS
*/

// Retrieve shelter data
app.get("/shelters", async (req, res) => {
  const data = await mongo.getMongoData("shelterData");
  res.send(data);
});

/**
  END
  SHELTER APIS
*/

/**
  START
  JACK POSTS APIS
*/

// Retrieve jack data
app.get("/jackData", async (req, res) => {
  const data = await mongo.getMongoData("jackData");
  res.send(data);
});

// Insert post
app.post("/jackData", bodyParser.json(), async (req, res) => {
  try {
    const response = await mongo.insertMongoData("jackData", req.body);
    res.status(200).send(`Post successfully inserted`);
  } catch (error) {
    res.status(500).send(`Error while attempting to insert post: ${error}`);
  }
});

// Edit post
app.put("/jackData", bodyParser.json(), async (req, res) => {
  try {
    const response = await mongo.editMongoData("jackData", req.body);
    res.status(200).send(`Post successfully edited`);
  } catch (error) {
    res.status(500).send(`Error while attempting to edit post: ${error}`);
  }
});

// Delete post
/**
  @param req pass objectId like so: { "_id" : ObjectId("636aef3cb7b07704bc64745c") }
*/
app.delete("/jackData", bodyParser.json(), async (req, res) => {
  try {
    const response = await mongo.deleteMongoData("jackData", req.body);
    res.status(200).send(`Post successfully deleted`);
  } catch (error) {
    res.status(500).send(`Error while attempting to delete post: ${error}`);
  }
});

/**
  END
  JACK POSTS APIS
*/

app.listen(5000);
