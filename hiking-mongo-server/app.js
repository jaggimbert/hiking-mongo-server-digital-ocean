const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const bodyParser = require("body-parser");
const { response } = require("express");
const mongo = require("./mongo.js");
const cors = require("cors");
const mongoClient = require("./mongoClient.js");
const client = mongoClient.getMongoClient();
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://jaggimbert:jiggaboo23@cluster0.pshyhnp.mongodb.net/mydb"
);
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    createddate: String,
    title: String,
    description: String,
    lat: String,
    lng: String,
    video_url: String,
  },
  { collection: "jackData" }
);

const postData = mongoose.model("PostData", postSchema);

// Retrieve jack data
app.get("/jackData", async (req, res, next) => {
  postData.find((err, data) => {
    console.log(data);
    res.send(data);
  });
});

// app.use(cors());
// app.use(
//   basicAuth({
//     users: {
//       jacques: "MyManJackyBoy",
//     },
//   })
// );
// /**
//   START UTILITY APIS
// */
// app.post("/shelters", async (req, res) => {
//   const data = await mongo.getMongoData("shelterData", client);
//   res.send(data);
// });
// /**
//   END UTILITY APIS
// */

// /**
//   START
//   SHELTER APIS
// */

// // Retrieve shelter data
// app.get("/shelters", async (req, res) => {
//   const data = await mongo.getMongoData("shelterData", client);
//   res.send(data);
// });

// /**
//   END
//   SHELTER APIS
// */

// /**
//   START
//   JACK POSTS APIS
// */

// // Retrieve jack data
// app.get("/jackData", async (req, res) => {
//   const data = await mongo.getMongoData("jackData", client);
//   res.send(data);
// });

// // Insert post
// app.post("/jackData", bodyParser.json(), async (req, res) => {
//   try {
//     const response = await mongo.insertMongoData("jackData", client, req.body);
//     res.status(200).send(`Post successfully inserted`);
//   } catch (error) {
//     res.status(500).send(`Error while attempting to insert post: ${error}`);
//   }
// });

// // Edit post
// app.put("/jackData", bodyParser.json(), async (req, res) => {
//   try {
//     const response = await mongo.editMongoData("jackData", client, req.body);
//     res.status(200).send(`Post successfully edited`);
//   } catch (error) {
//     res.status(500).send(`Error while attempting to edit post: ${error}`);
//   }
// });

// // Delete post
// /**
//   @param req pass objectId like so: { "_id" : ObjectId("636aef3cb7b07704bc64745c") }
// */
// app.delete("/jackData", bodyParser.json(), async (req, res) => {
//   try {
//     const response = await mongo.deleteMongoData("jackData", client, req.body);
//     res.status(200).send(`Post successfully deleted`);
//   } catch (error) {
//     res.status(500).send(`Error while attempting to delete post: ${error}`);
//   }
// });

// /**
//   END
//   JACK POSTS APIS
// */

app.listen(5000);
