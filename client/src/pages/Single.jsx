// src/pages/Single.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DOMPurify from "dompurify";

import EditIcon from "../img/edit.png";
import DeleteIcon from "../img/delete.png";
import Menu from "../components/Menu";
import { AuthContext } from "../context/authContext";

const Single = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // extract postId from URL: e.g. "/post/123"
  const postId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to load post:", err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="single">
      <div className="content">
        {/* Featured image */}
        {post.img && <img className="postImg" src={post.img} alt={post.title} />}

        {/* Author info and edit/delete buttons */}
        <div className="user">
          {post.userImg && (
            <img className="userImg" src={post.userImg} alt={post.username} />
          )}
          <div className="info">
            <span className="username">{post.username}</span>
            <p className="postDate">
              Posted {moment(post.date).fromNow()}
            </p>
          </div>
          {currentUser?.username === post.username && (
            <div className="edit">
              <Link
                to={`/write`}
                state={post}
              >
                <img src={EditIcon} alt="Edit post" />
              </Link>
              <img
                onClick={handleDelete}
                src={DeleteIcon}
                alt="Delete post"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="postTitle"          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.title || ""),
          }}>
       </h1>

        {/* Sanitized HTML description */}
        <div
          className="postDesc"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc || ""),
          }}
        />
      </div>

      {/* Sidebar/menu */}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
