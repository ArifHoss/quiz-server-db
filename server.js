const express = require("express");
const app = express();
const cors = require('cors');
const db = require("./database.js");
const bcrypt = require('bcrypt');



app.use(cors())
app.use(express.static('public'))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const HTTP_PORT = 3000;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/quiz", (req, res, next) => {
    const sql = "select * from quiz";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "quiz":rows
        })
      });
});


app.get("/api/quiz/:id", (req, res, next) => {
    const sql = "select * from quiz where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "quiz":row
        })
      });
});

app.get("/api/quizzes/:nr", (req,res,next) => {
    const sql = "SELECT * FROM quiz ORDER BY RANDOM() LIMIT ?";
    const params = [req.params.nr];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "quiz":rows
        })
    });
});


app.get("/api/quizzes/:category/:type/:nr", (req,res,next) => {
    const sql = "SELECT * FROM quiz WHERE category = ? AND type = ? ORDER BY RANDOM() LIMIT ?";
    const params = [req.params.category,req.params.type,req.params.nr];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "quiz":rows
        })
    });
});








app.get("/api/user/:username/:password", (req, res, next) => {
    const sql = "select * from user WHERE username = ?";
    const params = [req.params.username];
    let USER = ""

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        const isValidPass = bcrypt.compareSync(req.params.password, row.password);
        if(isValidPass){
            res.json({"message":"success", "user":row})
        }else{
            res.json({"message":"invalid username or password"})
        }
    });


});


app.post("/api/user", (req, res, next) => {
    const errors = [];
    if (!req.body.username || !req.body.email || !req.body.password){
        errors.push("Saknar data för att skapa konto");
    }
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        user_level : "user"
    };
    const sql = 'INSERT INTO user (email, username, password, user_level) VALUES (?,?,?,?)';
    const params = [data.email, data.username, data.password, data.user_level];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "user": data,
            "id" : this.lastID
        })
    });
})




/*  TODO: put med statistik över antal frågor
app.put("/api/bok/:id", (req, res, next) => {
    const data = {
        bokTitel: req.body.bokTitel,
        bokForfattare: req.body.bokForfattare,
        bokIsbn: req.body.bokIsbn,
        bokPris: req.body.bokPris
    };
    const sql = 'UPDATE bok SET bokTitel = ?, bokForfattare = ?, bokIsbn = ?, bokPris = ? WHERE bokId = ?';
    const params = [data.bokTitel, data.bokForfattare, data.bokIsbn, data.bokPris, req.params.id];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "bok": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/bok/:id", (req, res, next) => {
    db.run(
        'DELETE FROM bok WHERE bokId = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})




*/
// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

