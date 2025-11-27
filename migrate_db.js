import Database from 'better-sqlite3';
const db = new Database('server/database.sqlite');

try {
  console.log('Adding avatar column to users table...');
  db.prepare("ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT 'default'").run();
  console.log('Success!');
} catch (err) {
  if (err.message.includes('duplicate column name')) {
    console.log('Column already exists.');
  } else {
    console.error('Error adding column:', err.message);
  }
}

try {
  console.log('Creating schedules table...');
  db.exec(`
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
  console.log('Success!');
} catch (err) {
  console.error('Error creating schedules table:', err.message);
}
