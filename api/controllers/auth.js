import {db} from "./../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = (req , res ) => {

//check if user exists

const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query ( q , [req.body.email, req.body.name], (err,data)=> {
        if (err) return res.json (err)
            if (data.length) return res.status(409).json("user already exists")

//hash the password 

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //create a user

        const q = "INSERT INTO users (`username`, `email` , `password`) VALUES (?) "

        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]
        db.query (q, [values] , (err, data)  => {
        if (err) return res.json (err)
return res.status(200).json ("user has been created");
    });
                  
            })

}

export const login = (req , res ) => {
//check if user exists

const q = "SELECT * FROM users WHERE username = ?";

    db.query ( q , [req.body.username], (err,data)=> {
        if (err) return res.json (err)
            if (data.length===0) return res.status(404).json("user not found");

//CHECK PASSWORD 
 const isPassCorrect = bcrypt.compareSync (req.body.password , data[0].password);

 if (!isPassCorrect) return res.status(400).json ("wrong username or password");


const token = jwt.sign ( {id: data [0].id } , "key");
const { password, ...others} = data[0] 

res.cookie ("access_token", token   , {
    httpOnly:true
}).status(200).json(others);


}) 
};


export const logout = (req , res ) => {

    res.clearCookie ("access_token", {
        sameSite: "none", secure:true
    }).status(200).json("logout successful")
};