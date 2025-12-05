import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const dbDir = path.dirname(dbPath);

console.log(`Attempting to use database at: ${dbPath}`);
console.log(`Database directory: ${dbDir}`);

if (!fs.existsSync(dbDir)) {
  console.log(`Directory ${dbDir} does not exist. Creating...`);
  try {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Directory ${dbDir} created successfully.`);
  } catch (err) {
    console.error(`Failed to create database directory at ${dbDir}:`, err);
  }
} else {
  console.log(`Directory ${dbDir} already exists.`);
}

try {
  fs.accessSync(dbDir, fs.constants.W_OK);
  console.log(`Directory ${dbDir} is writable.`);
} catch (err) {
  console.error(`Directory ${dbDir} is NOT writable! This will cause the DB connection to fail.`, err);
}

let db;
try {
  db = new Database(dbPath);
  console.log(`Connected to database at: ${dbPath}`);
} catch (err) {
  console.error(`FAILED to connect to database at ${dbPath}:`, err);
  console.error('FALLING BACK TO IN-MEMORY DATABASE (Data will not be saved)');
  try {
    db = new Database(':memory:');
    // Re-run init script for memory db
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar TEXT DEFAULT 'default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL, -- JSON string of the workout data
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workout_id INTEGER NOT NULL,
        date TEXT NOT NULL, -- YYYY-MM-DD
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);
  } catch (memErr) {
    console.error('CRITICAL: Could not create in-memory database either!', memErr);
    // Only exit if even memory DB fails
    process.exit(1);
  }
}

// Initialize Database (for the main DB if it succeeded, or re-run if we want to be safe, but we did it above for memory)
// To be clean, let's just run the exec block on whatever 'db' we have.
// If it's the memory one, we already ran it, but running IF NOT EXISTS again is harmless.
if (db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar TEXT DEFAULT 'default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL, -- JSON string of the workout data
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workout_id INTEGER NOT NULL,
        date TEXT NOT NULL, -- YYYY-MM-DD
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);
}

export default db;
