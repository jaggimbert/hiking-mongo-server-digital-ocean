const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const isAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === "Basic amFjcXVlczpNeU1hbkphY2t5Qm95") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden");
  }
};

mongoose.connect(
  "mongodb+srv://jaggimbert:jiggaboo23@cluster0.pshyhnp.mongodb.net/mydb"
);
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    id: String,
    createddate: String,
    title: String,
    description: String,
    lat: Number,
    lng: Number,
    video_url: String,
    unix_time: Number,
  },
  { collection: "jackData" }
);

const postData = mongoose.model("PostData", postSchema);

const authScema = new Schema(
  {
    username: String,
    password: String,
  },
  { collection: "users" }
);

const authData = mongoose.model("AuthData", authScema);

app.use(cors());

// Retrieve jack data
app.post("/auth", bodyParser.json(), async (req, res, next) => {
  const docs = await authData.find({
    username: req.body.username,
    password: req.body.password,
  });
  const responseBody =
    docs.length > 0
      ? `Basic ${btoa(`${req.body.username}:${req.body.password}`)}`
      : "";
  res.send(responseBody);
});

// Retrieve jack data
app.get("/jackData", async (req, res, next) => {
  const docs = await postData.find().sort({ unix_time: -1 });
  res.send(docs);
});

app.post("/jackData", isAuth, bodyParser.json(), (req, res, next) => {
  let post = {
    createddate: new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: "true",
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: req.body.title,
    description: req.body.description,
    lat: req.body.lat,
    lng: req.body.lng,
    video_url: req.body.video_url ? req.body.video_url : "",
    unix_time: Date.now(),
  };

  let data = new postData(post);
  try {
    data.save();
    res.send("successful post").status(200);
  } catch (err) {
    res.send(`Error occurred while posting: ${err}`).status(500);
  }
});

app.put("/jackData", isAuth, bodyParser.json(), async (req, res) => {
  console.log("post: ", req.body);
  let id = req.body.post._id;

  postData.findById(id, (err, post) => {
    if (err) {
      console.error("error, no post found with id: ", id);
      res.status(500).send(`Error while attempting to edit post: ${error}`);
    } else {
      post.title = req.body.post.title;
      post.description = req.body.post.description;
      post.lat = req.body.post.lat;
      post.lng = req.body.post.lng;
      post.video_url = req.body.post.video_url;

      try {
        post.save();
        res.status(200).send(`Post successfully edited`);
      } catch (error) {
        res.status(500).send(`Error while attempting to edit post: ${error}`);
      }
    }
  });
});

app.delete("/jackData", isAuth, bodyParser.json(), async (req, res) => {
  let id = req.body.id;
  try {
    postData.findByIdAndRemove(id).exec();
    res.status(200).send(`Post successfully deleted`);
  } catch (error) {
    res.status(500).send(`Error while attempting to delete post: ${error}`);
  }
});

app.listen(5000);
