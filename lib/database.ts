import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI environment variable is not set. Database features will be disabled.')
}

const uri = process.env.MONGODB_URI

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null

  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
      _mongoClient?: MongoClient
    }
    if (!globalWithMongo._mongoClientPromise) {
      const c = new MongoClient(uri, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 10,
      })
      globalWithMongo._mongoClient = c
      globalWithMongo._mongoClientPromise = c.connect().catch(err => {
        // Clear on failure so next request retries
        delete (global as any)._mongoClientPromise
        delete (global as any)._mongoClient
        throw err
      })
    }
    return globalWithMongo._mongoClientPromise
  } else {
    // Production - single module-level promise
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 10,
      })
      clientPromise = client.connect()
    }
    return clientPromise
  }
}

export async function getDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Please set up your database connection.')
  }

  const promise = getClientPromise()
  if (!promise) {
    throw new Error('MongoDB client not initialized')
  }

  try {
    const connectedClient = await promise
    return connectedClient.db()
  } catch (error) {
    // Reset so next request retries with fresh connection
    if (process.env.NODE_ENV === 'development') {
      delete (global as any)._mongoClientPromise
      delete (global as any)._mongoClient
    } else {
      clientPromise = null
      client = null
    }
    console.error('MongoDB connection error:', error)
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function isDatabaseAvailable(): boolean {
  return !!uri
}

export default getClientPromise()
