import express from "express"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"
import dotenv from "dotenv"

// Load environment variables
dotenv.config();

const upload = multer({ dest: 'uploads/' })

const app = express()
const port = process.env.PORT || 8000;

<<<<<<< HEAD





const app = express ()
const port = process.env.PORT || 8000;

app.use(cors());

app.use (express.json());
=======
// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "your-production-domain.com" : "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
>>>>>>> 013f85f0ec06782e3a25616acb5a4a85a7c6969a
app.use(cookieParser());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

app.get ("/",  (req,res) => {
    res.send("hello");
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


