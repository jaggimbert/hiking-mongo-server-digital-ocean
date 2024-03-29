const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");

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
app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

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
  let body = req.body;

  postData.findById(body._id, (err, post) => {
    if (err) {
      res.status(500).send(`Error while attempting to edit post: ${error}`);
    } else {
      post.title = body.title ? body.title : "";
      post.description = body.description ? body.description : "";
      post.video_url = body.video_url ? body.video_url : "";

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

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/jackontheatserver.com/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/jackontheatserver.com/fullchain.pem"
    ),
  },
  app
);

httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
