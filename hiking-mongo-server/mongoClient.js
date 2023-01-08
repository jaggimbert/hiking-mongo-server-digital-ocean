const { MongoClient, ServerApiVersion } = require("mongodb");

//Initialize Mongo Client
const getMongoClient = () => {
  const uri =
    "mongodb+srv://jaggimbert:jiggaboo23@cluster0.pshyhnp.mongodb.net/?retryWrites=true&w=majority&maxIdleTimeMS=5000";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  return client;
};

exports.getMongoClient = getMongoClient;
