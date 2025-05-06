<<<<<<< HEAD
import { db } from "./../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = (req, res) => {
  const { username, email, password } = req.body;
  // 1️⃣ Validate input
  if (!username || !email || !password) {
    return res.status(400).json("Missing required fields");
  }

  // 2️⃣ Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(checkUserQuery, [email, username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");

    // 3️⃣ Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // 4️⃣ Insert new user
    const insertUserQuery = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const values = [username, email, hash];
    db.query(insertUserQuery, [values], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json("User has been created");
    });
  });
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = (req, res) => {
  const { username, password } = req.body;
  // 1️⃣ Validate input
  if (!username || !password) {
    return res.status(400).json("Missing required fields");
  }

  // 2️⃣ Look up user
  const findUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(findUserQuery, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    // 3️⃣ Verify password
    const user = data[0];
    const isPassCorrect = bcrypt.compareSync(password, user.password);
    if (!isPassCorrect) return res.status(400).json("Wrong username or password");

    // 4️⃣ Sign JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const { password: pw, ...others } = user;

    // 5️⃣ Send cookie + user data
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json(others);
  });
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json("Logout successful");
};
=======
import {db} from "./../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

// Load environment variables
dotenv.config();

// Register function to handle user registration
export const register = (req , res ) => {
    // Check if user already exists by email or username
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err,data)=> {
        if (err) return res.json(err)
        if (data.length) return res.status(409).json("user already exists")

        // Hash the password for security
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Create new user in database
        const q = "INSERT INTO users (`username`, `email` , `password`) VALUES (?) "
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]
        db.query(q, [values], (err, data) => {
            if (err) return res.json(err)
            return res.status(200).json("user has been created");
        });
    })
}

// Login function to handle user authentication
export const login = (req , res ) => {
    // Check if user exists by username
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err,data)=> {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("user not found");

        // Verify password
        const isPassCorrect = bcrypt.compareSync(req.body.password, data[0].password);
        if (!isPassCorrect) return res.status(400).json("wrong username or password");

        // Create JWT token for authentication
        const token = jwt.sign(
            {id: data[0].id}, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        // Remove password from user data before sending response
        const { password, ...others} = data[0] 

        // Set cookie with token and send user data
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json(others);
    }) 
};

// Logout function to handle user logout
export const logout = (req , res ) => {
    // Clear the authentication cookie
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }).status(200).json("logout successful")
};
>>>>>>> 013f85f0ec06782e3a25616acb5a4a85a7c6969a
