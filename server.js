require("dotenv").config();
const express = require("express");
const mysql = require("mysql2"); // Updated to mysql2
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com", // Cloud SQL Host
  user: "sql12769479", // MySQL Username
  password: "GPrTGdSNWG", // MySQL Password
  database: "sql12769479", // MySQL Database Name
  port: 3306, // Default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error(" Database connection failed:", err);
    return;
  }
  console.log("Connected to Cloud SQL Database");
});

// Check if Table "Data" Exists
app.get("/check-table", (req, res) => {
  db.query("SHOW TABLES LIKE 'Data'", (err, results) => {
    if (err) {
      console.error(" Error checking table existence:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Table 'Data' not found!" });
    }
    res.json({ message: "Table 'Data' exists" });
  });
});

// Fetch Log Data API
app.get("/logs", (req, res) => {
  db.query("SELECT id, date, data FROM Data ORDER BY date DESC", (err, results) => {
    if (err) {
      console.error(" Error fetching logs:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Function to Insert Log Data Every Minute
const insertLogData = () => {
  const date = new Date().toISOString().slice(0, 19).replace("T", " "); // Auto-generate timestamp
  const data = 7518; // Fixed data value

  console.log(` Attempting to insert log: Date=${date}, Data=${data}`);

  db.query("INSERT INTO Data (date, data) VALUES (?, ?)", [date, data], (err, result) => {
    if (err) {
      console.error(" Error inserting log:", err);
      return;
    }
    console.log(" Log inserted successfully, ID:", result.insertId);
  });
};

// Schedule Log Insertion Every 1 Minute
setInterval(insertLogData, 60000);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));


