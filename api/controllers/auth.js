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