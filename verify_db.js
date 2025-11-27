import Database from 'better-sqlite3';
const db = new Database('server/database.sqlite');

console.log('--- Schema Info ---');
const schema = db.prepare("PRAGMA table_info(schedules)").all();
console.log(schema);

console.log('\n--- Recent Schedules ---');
const rows = db.prepare("SELECT * FROM schedules ORDER BY id DESC LIMIT 5").all();
console.log(rows);
