import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'

const env = readFileSync('.env', 'utf8')
const uri = env.match(/MONGODB_URI=(.+)/)?.[1]?.trim()

const client = await MongoClient.connect(uri)
const db = client.db()

const roles = await db.collection('users').aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } }
]).toArray()

console.log('User counts by role:', JSON.stringify(roles, null, 2))
await client.close()
