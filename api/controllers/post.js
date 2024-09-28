import { db } from "../db.js"
import jwt from "jsonwebtoken"

export const addPost = (req,res) => {

}


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


export const updatePost = (req, res) => { 

}



export const deletePost = (req , res) => {
  
  const token = req.cookies.access_token
if (!token) return res.status(401).json ("not authentificated");

jwt.verify(
  
  token, "key" ,
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


