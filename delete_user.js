import Database from 'better-sqlite3';
const db = new Database('server/database.sqlite');
const info = db.prepare("DELETE FROM users WHERE username = 'Frame'").run();
console.log(`Deleted ${info.changes} user(s)`);
