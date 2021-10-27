const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "quiz.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY,
            email TEXT,
            username TEXT,
            password TEXT,
            user_level TEXT,
            questions_answered INTEGER,
            questions_correct INTEGER
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            const insert = 'INSERT INTO user (email, username, password, user_level, questions_answered, questions_correct) VALUES (?,?,?,?,?,?)';
            db.run(insert, ["bosse@hotbrev.com", "BossemanneN", "guest123", "user",22,2])
        }
    })
    }
})


module.exports = db

