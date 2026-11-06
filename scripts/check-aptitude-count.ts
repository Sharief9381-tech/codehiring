import "dotenv/config"
import { MongoClient } from "mongodb"
const URI = process.env.MONGODB_URI!
async function main() {
  const client = new MongoClient(URI)
  await client.connect()
  const count = await client.db().collection("aptitude_questions").countDocuments()
  console.log(`aptitude_questions count: ${count}`)
  await client.close()
}
main().catch(console.error)
