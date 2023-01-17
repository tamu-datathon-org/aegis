//TODO: Create a singleton for the connection so that we aren't using global.mongo and get an "error"
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB;

if (MONGODB_URI === "") {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (MONGODB_DB === "") {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

export class MongoDBSingleton {
  private static instance: Promise<MongoClient>;
  public static async getInstance(): Promise<Db> {
    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = MongoClient.connect(MONGODB_URI);
    }
    const client = await MongoDBSingleton.instance;
    return client.db(MONGODB_DB);
}
}
