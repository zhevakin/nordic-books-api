const { MongoClient } = require("mongodb");


export default async function db() {
  return await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
}
