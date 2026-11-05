import "dotenv/config"
import { MongoClient } from "mongodb"

const URI = process.env.MONGODB_URI
if (!URI) { console.error("MONGODB_URI not set"); process.exit(1) }

async function main() {
  const email = process.argv[2] || "saminenivinay999@gmail.com"
  const client = new MongoClient(URI!)
  await client.connect()
  const db = client.db()

  const user = await db.collection("users").findOne(
    { email },
    { projection: { password: 0 } }
  )

  if (!user) {
    console.log(`\n❌ Not found: ${email}`)
  } else {
    console.log(`\n✅ Found:`)
    console.log(`  _id         : ${user._id}`)
    console.log(`  name        : ${user.name}`)
    console.log(`  email       : ${user.email}`)
    console.log(`  role        : ${user.role}`)
    console.log(`  collegeCode : ${user.collegeCode ?? "(none)"}`)
    console.log(`  branch      : ${user.branch ?? "(none)"}`)
    console.log(`  gradYear    : ${user.graduationYear ?? "(none)"}`)
    console.log(`  createdAt   : ${user.createdAt}`)
  }

  await client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
