import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://Codehire:7JGC3O10YuaK9Sb8@cluster0.f0js6qo.mongodb.net/codetrack?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })

await client.connect()
const db = client.db('codetrack')
const cols = await db.listCollections().toArray()

console.log(`\n✅ Connected to MongoDB Atlas — database: codetrack`)
console.log(`📦 Collections (${cols.length}):\n`)

for (const col of cols) {
  const count = await db.collection(col.name).countDocuments()
  console.log(`  ${col.name.padEnd(20)} ${count} documents`)
}

await client.close()
console.log('\nDone.')
