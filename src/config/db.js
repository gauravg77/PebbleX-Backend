
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb+srv://ghimiregaurav357:ghimiregaurav%40357_@pebblexapi.dpxdbbo.mongodb.net/?appName=PebblexAPI";

let client;

async function connectDB() {
  if (client) return client;

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB connected successfully');
    return client;
  } catch (err) {
    client = null;
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connectDB };