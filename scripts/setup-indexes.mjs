import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv(p) {
  try {
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const eq = line.indexOf("="); if (eq < 0 || line.trim().startsWith("#")) continue
      const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim()
      if (k && !process.env[k]) process.env[k] = v
    }
  } catch {}
}
loadEnv(join(__dirname, "../.env"))

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db("codetrack")

// sessions: fast token lookup + auto-expiry
await db.collection("sessions").createIndex({ token: 1 }, { unique: true, name: "token_unique" }).catch(() => {})
await db.collection("sessions").createIndex({ expiresAt: 1 }, { name: "expires_ttl", expireAfterSeconds: 0 }).catch(() => {})
console.log("sessions indexes OK")

// Delete expired sessions
const del = await db.collection("sessions").deleteMany({ expiresAt: { $lt: new Date() } })
console.log("Deleted expired sessions:", del.deletedCount)

const count = await db.collection("sessions").countDocuments({ expiresAt: { $gt: new Date() } })
console.log("Valid sessions remaining:", count)

// questions_cache: TTL for auto-expiry
await db.collection("questions_cache").createIndex({ createdAt: 1 }, { name: "cache_ttl", expireAfterSeconds: 86400 }).catch(() => {})
console.log("questions_cache TTL index OK")

// users: email lookup
await db.collection("users").createIndex({ email: 1 }, { unique: true, name: "email_unique" }).catch(() => {})
console.log("users email index OK")

await client.close()
console.log("Done.")
