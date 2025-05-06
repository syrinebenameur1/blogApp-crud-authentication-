import { db } from "../db.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

// Load environment variables
dotenv.config();


export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
      INSERT INTO posts(title, \`desc\`, img, cat, \`date\`, uid)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const vals = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    

    db.query(q, vals, (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Post has been created.");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    // only allow owner to update
    const q = `
      UPDATE posts
      SET title = ?, \`desc\` = ?, img = ?, cat = ?
      WHERE id = ? AND uid = ?
    `;
    const vals = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id,
    ];

    db.query(q, vals, (err, data) => {
      if (err) return res.status(500).json(err);
      // data.affectedRows will be 0 if no matching post / user
      if (data.affectedRows === 0)
        return res.status(403).json("You can update only your post!");
      res.status(200).json("Post has been updated.");
    });
  });
};




export const getPost = (req, res) => {
    const q =
      "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json(data[0]);
    });
  };


export const getPosts = (req,res) => {
const q = req.query.cat ? "SELECT * FROM posts WHERE  cat = ? " : "SELECT * FROM posts";

db.query (q , [req.query.cat], (err,result) => {
    if (err) return res.status(500).json ({error:err})
        res.status(200).json(result);
})

}





export const deletePost = (req , res) => {
  
  const token = req.cookies.access_token
if (!token) return res.status(401).json ("not authentificated");

jwt.verify(
  
  token, process.env.JWT_SECRET,
   (err,userInfo)=> {
  if (err) return res.status(403).json ("token is not valid");


  const postId = req.params.id;
  const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

  db.query(q, [postId, userInfo.id], (err, data) => {
    if (err) return res.status(403).json("You can delete only your post!");

    return res.json("Post has been deleted!");

})


});
}


