import db from './server/database.js';

console.log("--- USERS ---");
const users = db.prepare('SELECT * FROM users').all();
console.log(JSON.stringify(users, null, 2));

console.log("\n--- WORKOUTS ---");
const workouts = db.prepare('SELECT id, user_id, name FROM workouts').all();
console.log(JSON.stringify(workouts, null, 2));
