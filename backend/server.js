const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "emp_management",
});

db.connect((err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("DB connected!");
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// Create Employee
app.post("/api/employees", upload.single("profilePic"), (req, res) => {
  const { name, employeeId, department, designation, project, type, status } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  if (!name || !employeeId || !department || !designation || !project || !type || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO employees (name, employeeId, department, designation, project, type, status, profilePic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, employeeId, department, designation, project, type, status, profilePic], (err) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.status(200).json({ message: "Employee added successfully!" });
  });
});

// Get All Employees
app.get("/api/employees", (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id", (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.status(200).json(results);
  });
});

// Get Single Employee
app.get("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(results[0]);
  });
});

// Update Employee
app.put("/api/employees/:id", upload.single("profilePic"), (req, res) => {
  const { id } = req.params;
  const { name, employeeId, department, designation, project, type, status } = req.body;
  const profilePic = req.file ? req.file.filename : req.body.profilePic || null;

  const sql =
    "UPDATE employees SET name=?, employeeId=?, department=?, designation=?, project=?, type=?, status=?, profilePic=? WHERE id=?";
  db.query(sql, [name, employeeId, department, designation, project, type, status, profilePic, id], (err) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.status(200).json({ message: "Employee updated successfully!" });
  });
});

// Delete Employee
app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.status(200).json({ message: "Employee deleted successfully!" });
  });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
