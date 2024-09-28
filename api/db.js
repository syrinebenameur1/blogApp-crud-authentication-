import mysql from "mysql2";

// Create a connection to the MySQL database
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Syrine2024",
    database: "blog"
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database!");
});
