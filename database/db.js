const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/gateprep.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite Database");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student'
        )
    `);

    db.run(`
         CREATE TABLE IF NOT EXISTS materials (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              subject TEXT NOT NULL,
              topic TEXT NOT NULL,
             difficulty TEXT,
             content TEXT,
             pdf_path TEXT,
             created_by TEXT,
             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);

db.run(`
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    total_marks INTEGER DEFAULT 0,
    available_from DATETIME,
    available_until DATETIME,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT,
    marks REAL DEFAULT 1,
    negative_marks REAL DEFAULT 0
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS attempts (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_email TEXT NOT NULL,

    quiz_id INTEGER NOT NULL,

    score REAL DEFAULT 0,

    correct_count INTEGER DEFAULT 0,

    wrong_count INTEGER DEFAULT 0,

    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

});

module.exports = db;