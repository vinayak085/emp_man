import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memoryServerInstance = null;

/**
 * Sanitizes a MongoDB connection URI for safe console logging (masks credentials).
 * @param {string} uri 
 * @returns {string}
 */
const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/(mongodb(\+srv)?:\/\/)([^:@]+):([^@]+)@/, '$1***:***@');
};

/**
 * Resolves the canonical MongoDB connection string from environment variables.
 * @returns {string|null}
 */
export const getMongoUri = () => {
  let uri = process.env.MONGODB_URI || process.env.MONGODBURI;

  if (!uri) {
    return null;
  }

  // If URI has placeholder tokens and separate credentials are provided, substitute them
  const username = process.env.MONGODB_USERNAME || process.env.MONGODBUSERNAME;
  const password = process.env.MONGODB_PASSWORD || process.env.MONGODBPASSWORD;

  if (username && password) {
    if (uri.includes('<username>') || uri.includes('<password>')) {
      uri = uri
        .replace('<username>', encodeURIComponent(username))
        .replace('<password>', encodeURIComponent(password));
    }
  }

  return uri;
};

/**
 * Connects to MongoDB Atlas or falls back to MongoMemoryServer for development/testing
 * if Atlas credentials are placeholders or unreachable.
 */
export const connectDB = async () => {
  const uri = getMongoUri();
  const isPlaceholder = !uri || uri.includes('yourmongodbatlasconnectionstring') || uri.includes('<password>');

  if (!isPlaceholder) {
    try {
      console.log(`[DB] Attempting connection to postgress: ${sanitizeMongoUri(uri)}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 7000,
        dbName: process.env.MONGODB_DBNAME || 'employee_management',
      });
      console.log(`[DB] postgresssql Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[DB Error] Failed to connect to postgressql: ${err.message}`);
      console.error('[DB Note] Verify that your IP address is whitelisted in Atlas Network Access (0.0.0.0/0) and credentials are valid.');
      
      // If in-memory fallback is allowed, fall through
      if (process.env.USE_IN_MEMORY_DB !== 'true') {
        throw err;
      }
      console.log('[DB] Falling back to In-Memory postgressql for local development/testing...');
    }
  } else {
    console.log('[DB Info] postgressql URI is not configured or contains placeholder values.');
  }

  // Fallback to MongoMemoryServer if requested or if Atlas is not yet configured
  if (process.env.USE_IN_MEMORY_DB === 'true' || process.env.NODE_ENV === 'test') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      console.log('[DB] Starting In-Memory MongoDB Server...');
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] In-Memory MongoDB Connected at: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error('[DB Error] Failed to initialize in-memory database:', memErr.message);
      throw memErr;
    }
  }

  throw new Error('No valid MongoDB URI configured. Please update MONGODB_URI in backend/.env');
};

/**
 * Disconnects from MongoDB and stops any active in-memory instance.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      memoryServerInstance = null;
    }
    console.log('[DB] Disconnected from database.');
  } catch (err) {
    console.error('[DB Error] Error disconnecting:', err.message);
  }
};
