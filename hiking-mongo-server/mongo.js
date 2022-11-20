const { MongoClient, ServerApiVersion } = require("mongodb");
const bson = require("bson");

//Connect to mongo and return all data for specified collection
const getMongoData = (collectionName) => {
  const client = getMongoClient();
  const collection = client.db("mydb").collection(collectionName);
  const cursor = collection.find();
  return cursor.toArray();
};

//Connect to mongo and insert data
const insertMongoData = async (collectionName, req) => {
  const client = getMongoClient();
  const collection = client.db("mydb").collection(collectionName);
  const result = await collection.insertOne(req);
  return result;
};

//Connect to mongo and edit data
const editMongoData = async (collectionName, req) => {
  console.log("request: ", req);
  const client = getMongoClient();
  const collection = client.db("mydb").collection(collectionName);
  const result = await collection
    .updateOne(
      { _id: bson.ObjectID(req.Id) },
      {
        $set: req.body,
      }
    )
    .catch((err) => console.log("MONGO ERROR: ", err));
  console.log("MONGO UPDATE RESULT: ", result);
  return result;
};

//Connect to mongo and delete data
const deleteMongoData = async (collectionName, req) => {
  const client = getMongoClient();
  const collection = client.db("mydb").collection(collectionName);
  const result = await collection.deleteOne({ _id: bson.ObjectID(req.Id) });
  return result;
};

//Initialize Mongo Client
const getMongoClient = () => {
  const uri =
    "mongodb+srv://jaggimbert:jiggaboo23@cluster0.pshyhnp.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  return client;
};

exports.getMongoData = getMongoData;
exports.insertMongoData = insertMongoData;
exports.editMongoData = editMongoData;
exports.deleteMongoData = deleteMongoData;
