import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB;

if (MONGODB_URI === '') {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (MONGODB_DB === '') {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

export class MongoDBSingleton {
  private static instance: Promise<MongoClient> | null = null;

  // Define timeout options
  private static connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000, // Example: 10 seconds
    socketTimeoutMS: 15000, // Example: 15 seconds
    maxIdleTimeMS: 15000, // Example: 15 seconds
  };

  public static async getInstance(): Promise<Db> {
    if (!MongoDBSingleton.instance) {
      const connectionPromise = MongoClient.connect(MONGODB_URI, MongoDBSingleton.connectionOptions);

      MongoDBSingleton.instance = connectionPromise;
    }

    const client = await MongoDBSingleton.instance;
    return client.db(MONGODB_DB);
  }
}
