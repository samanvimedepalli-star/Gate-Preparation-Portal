const express = require("express");
const cors = require("cors");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database/db");

const app = express();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");
    },

    filename: function(req, file, cb){

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );
    }

});

const upload = multer({
    storage: storage
});

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));

app.use(
    "/uploads",
    express.static("uploads")
);
app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function (err) {

                if (err) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                res.json({
                    message: "User Registered Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: "Server Error"
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                "gate_secret_key",
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                message: "Login Successful",
                token,
                role: user.role
            });

        }
    );

});

app.post("/materials", (req, res) => {

    const {
        subject,
        topic,
        difficulty,
        content,
        pdf_path,
        created_by
    } = req.body;

    db.run(
        `INSERT INTO materials
        (subject, topic, difficulty, content, pdf_path, created_by)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            subject,
            topic,
            difficulty,
            content,
            pdf_path,
            created_by
        ],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Material Added Successfully"
            });

        }
    );

});

app.post("/quizzes", (req, res) => {

    const {
        title,
        subject,
        duration_minutes,
        available_from,
        available_until,
        created_by
    } = req.body;

    db.run(
        `INSERT INTO quizzes
        (
            title,
            subject,
            duration_minutes,
            available_from,
            available_until,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            title,
            subject,
            duration_minutes,
            available_from,
            available_until,
            created_by
        ],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Quiz Created Successfully"
            });

        }
    );

});

app.post("/questions", (req, res) => {

    const {
        quiz_id,
        question,
        question_type,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        marks,
        negative_marks
    } = req.body;

    db.run(
        `INSERT INTO questions
        (
            quiz_id,
            question,
            question_type,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            marks,
            negative_marks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            quiz_id,
            question,
            question_type,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            marks,
            negative_marks
        ],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Question Added Successfully"
            });

        }
    );

});


app.post("/attempts", (req, res) => {

    const {
        user_email,
        quiz_id,
        score,
        correct_count,
        wrong_count
    } = req.body;

    db.run(
        `INSERT INTO attempts
        (
            user_email,
            quiz_id,
            score,
            correct_count,
            wrong_count
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            user_email,
            quiz_id,
            score,
            correct_count,
            wrong_count
        ],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Attempt Saved"
            });

        }
    );

});

app.post(
    "/upload-pdf",
    upload.single("pdf"),
    (req, res) => {

        res.json({
            message: "PDF Uploaded",
            file: req.file.filename
        });

    }
);

app.get("/questions/:quizId", (req, res) => {

    const quizId = req.params.quizId;

    db.all(
        "SELECT * FROM questions WHERE quiz_id = ?",
        [quizId],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.get("/allquestions", (req, res) => {

    db.all(
        "SELECT * FROM questions",
        [],
        (err, rows) => {

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }
    );

});

app.get("/quizzes", (req, res) => {

    db.all(
        "SELECT * FROM quizzes ORDER BY created_at DESC",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.get("/materials", (req, res) => {

    db.all(
        "SELECT * FROM materials ORDER BY created_at DESC",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.get("/makeadmin", (req, res) => {

    db.run(
        "UPDATE users SET role='admin'",
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Admin Created",
                updatedRows: this.changes
            });

        }
    );

});

console.log("Users route loaded");

app.get("/users", (req, res) => {

    db.all(
        "SELECT id, name, email, role FROM users",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});


app.get("/", (req, res) => {
    res.send("GATE Prep Portal Backend Running 🚀");
});

app.get("/attempts", (req, res) => {

    db.all(
        "SELECT * FROM attempts",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.get("/attempts/check", (req, res) => {

    const user_email =
        req.query.user_email;

    const quiz_id =
        req.query.quiz_id;

    db.get(
        `SELECT * FROM attempts
         WHERE user_email = ?
         AND quiz_id = ?`,
        [
            user_email,
            quiz_id
        ],
        (err, row) => {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                attempted:
                row ? true : false
            });

        }
    );

});

app.get("/clearAttempts", (req, res) => {

    db.run(
        "DELETE FROM attempts",
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "All attempts cleared"
            });

        }
    );

});

app.get("/stats", (req, res) => {

    db.get(
        `
        SELECT
        (SELECT COUNT(*) FROM materials) AS materials,
        (SELECT COUNT(*) FROM quizzes) AS quizzes,
        (SELECT COUNT(*) FROM attempts) AS attempts,
        (
            SELECT
            ROUND(
                AVG(
                    CASE
                    WHEN (correct_count + wrong_count)=0
                    THEN 0
                    ELSE
                    (correct_count*100.0)/
                    (correct_count+wrong_count)
                    END
                ),2
            )
            FROM attempts
        ) AS accuracy
        `,
        [],
        (err,row)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.json(row);

        }

    );

});

app.get("/latest-material", (req, res) => {

    db.get(
        `
        SELECT *
        FROM materials
        ORDER BY id DESC
        LIMIT 1
        `,
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(row);

        }
    );

});

app.get("/recent-attempts", (req, res) => {

    db.all(
        `
        SELECT *
        FROM attempts
        ORDER BY id DESC
        LIMIT 5
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );

});

app.get("/attempts", (req, res) => {

    db.all(
        `
        SELECT *
        FROM attempts
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});