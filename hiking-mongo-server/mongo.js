const bson = require("bson");

//Connect to mongo and return all data for specified collection
const getMongoData = async (collectionName, client) => {
  // const client = await getMongoClient();
  const collection = await client.db("mydb").collection(collectionName);
  const data = await collection.find().toArray();
  return data;
};

//Connect to mongo and insert data
const insertMongoData = async (collectionName, client, req) => {
  // const client = await getMongoClient();
  const collection = await client.db("mydb").collection(collectionName);
  const result = await collection.insertOne(req);
  return result;
};

//Connect to mongo and edit data
const editMongoData = async (collectionName, client, req) => {
  // const client = await getMongoClient();
  const collection = await client.db("mydb").collection(collectionName);
  const result = await collection
    .updateOne(
      { _id: bson.ObjectID(req.Id) },
      {
        $set: req.body,
      }
    )
    .catch((err) => console.log("MONGO ERROR: ", err));
  return result;
};

//Connect to mongo and delete data
const deleteMongoData = async (collectionName, client, req) => {
  // const client = getMongoClient();
  const collection = client.db("mydb").collection(collectionName);
  const result = await collection.deleteOne({ _id: bson.ObjectID(req.Id) });
  return result;
};

exports.getMongoData = getMongoData;
exports.insertMongoData = insertMongoData;
exports.editMongoData = editMongoData;
exports.deleteMongoData = deleteMongoData;
