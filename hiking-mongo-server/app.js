const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const isAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  console.log(auth);
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
    createddate: String,
    description: String,
    lat: Number,
    lng: Number,
    video_url: String,
    unix_time: Number,
  },
  { collection: "jackData" }
);

const postData = mongoose.model("PostData", postSchema);

app.use(cors());

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
  let id = req.body.id;

  postData.findById(id, (err, post) => {
    if (err) {
      console.error("error, no post found with id: ", id);
      res.status(500).send(`Error while attempting to edit post: ${error}`);
    } else {
      post.description = req.body.description;
      post.lat = req.body.lat;
      post.lng = req.body.lng;
      post.video_url = req.body.video_url;

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
