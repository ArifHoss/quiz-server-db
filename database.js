const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "bok.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE bok (
            bokId INTEGER PRIMARY KEY,
            bokTitel TEXT,
            bokForfattare TEXT,
            bokIsbn TEXT,
            bokPris REAL
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            const insert = 'INSERT INTO bok (bokTitel, bokForfattare, bokIsbn, bokPris) VALUES (?,?,?,?)';
            db.run(insert, ["Old Man and the Sea", "Ernest Hemingway", "12345-6", 89])
        }
    })  
    }
})


module.exports = db

