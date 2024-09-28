import express from "express"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"
const upload = multer({ dest: 'uploads/' })



const app = express ()
const port = 8000;

app.use(cors());

app.use (express.json());
app.use(cookieParser());
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);




app.get ("/",  (req,res) => {
    res.send("hello");
})
app.listen ( port , () => {
    console.log("connected to port :" , port);
})


