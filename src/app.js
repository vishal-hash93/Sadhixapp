const express = require('express');
const path = require('path');
const mysql = require('mysql');

// Run express server
const app = express();
const PORT = 3000; // You can change the port if needed

// Establishing a connection with the database
const connection = mysql.createConnection({
  host: '172.31.3.74',
  user: 'root',
  password: 'Password@1234',
  database: 'sadhixdb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

// Serve static files from the 'public' directory
// console.log(__dirname);
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API Endpoint to Fetch User Details
app.get("/user/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID." });
    }

    const sqlQuery = `SELECT * FROM USER_INFO WHERE id = ?`;
    connection.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed." });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        // res.send(result[0].name + ' works for ' + result[0].company_name);
        res.json(result[0]);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
