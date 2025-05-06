import mysql from "mysql2";
<<<<<<< HEAD
import dotenv from "dotenv"

dotenv.config();



export const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // port:   process.env.DB_PORT,        // uncomment if you need a custom port
});
=======
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create database connection pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}).promise();
>>>>>>> 013f85f0ec06782e3a25616acb5a4a85a7c6969a

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database!");
});
