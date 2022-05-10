const { MongoClient } = require("mongodb");

async function dbConnect() {
  return await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
}

module.exports = dbConnect
