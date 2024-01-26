import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import axios from "axios";
import { useSelector } from "react-redux";

const Comments = ({ postID }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [toggleCommentButtons, setToggleCommentButtons] = useState(false);
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.post(`https://discussionforum.onrender.com/comment/getAllCommentsAtPost`, {
          headers: {
            Authorization: `${loggedInUser.token}`,
          },
          postID,
        });
        setComments(res.data.comments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [postID, loggedInUser]);

  const handleCommentSubmission = async (e) => {
    if (!loggedInUser) {
      console.log("Sign In required!");
      setToggleCommentButtons(false);
      return;
    }
    try {
      const res = await axios.post(`https://discussionforum.onrender.com/comment/commentAtPost`, {
        headers: {
          Authorization: `${loggedInUser.token}`,
        },
        postID,
        content: newCommentText,
      });
      setComments((prev) => [...prev, res.data.comment]);
      setNewCommentText("");
      setToggleCommentButtons(false);
      setTimeout(1000)
    } catch (error) {
      console.log(error);
      console.log("Unable to post a comment");
    }
  };

  const handleCancel = (e) => {
    setNewCommentText("");
    setToggleCommentButtons(false);
  };

  return (
    <div className="comments-container">
      {loggedInUser && (
        <>
          <div>
            <input
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onFocus={(e) => setToggleCommentButtons(true)}
              className="form-control mb-2"
              style={styles.textArea}
            />
          </div>
          <div>
            <button onClick={handleCancel} className="btn btn-danger" style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleCommentSubmission} className="btn btn-success" style={styles.commentButton}>
              Comment
            </button>
          </div>
        </>
      )}

      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Comment key={comment._id} comment={comment} style={index % 2 === 0 ? styles.commentOdd : styles.commentEven} />
        ))
      ) : (
        <span style={styles.noComments}>No Comments for this post</span>
      )}
    </div>
  );
};

const styles = {
  textArea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  cancelButton: {
    borderRadius: "5px",
    marginRight: "10px",
  },
  commentButton: {
    borderRadius: "5px",
  },
  commentOdd: {
    background: "#f0f0f0",  
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  commentEven: {
    background: "#e0e0e0",  
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  noComments: {
    color: "#777",
  },
};

export default Comments;
