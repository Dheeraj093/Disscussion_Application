import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import Reply from "./Reply";
import axios from "axios";
import { useSelector } from "react-redux";

const Comments = ({ postID }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [toggleCommentButtons, setToggleCommentButtons] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.post(
          `https://discussionforum.onrender.com/comment/getAllCommentsAtPost`,
          {
            headers: {
              Authorization: `${loggedInUser.token}`,
            },
            postID,
          }
        );
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

      setTimeout(() => {
        setShowComments(true);
      }, 1000);
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

      {showComments ? (
        <>
          <button onClick={() => setShowComments(false)} className="btn btn-primary" style={styles.hideCommentsButton}>
            Hide Comments
          </button>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Comment
                key={comment._id}
                comment={comment}
                style={index % 2 === 0 ? styles.commentOdd : styles.commentEven}
              />
            ))
          ) : (
            <span style={styles.noComments}>No Comments for this post</span>
          )}
        </>
      ) : (
        <button onClick={() => setShowComments(true)} className="btn btn-primary" style={styles.showCommentsButton}>
          Show Comments
        </button>
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
    backgroundColor:"#ea8a8a"
  },
  commentButton: {
    borderRadius: "5px",
    backgroundColor:"#6db193"
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
  showCommentsButton: {
    borderRadius: "5px",
    marginTop: "10px",
    width:"100%",
    backgroundColor:"#927fbf"
  },
  hideCommentsButton: {
    borderRadius: "5px",
    marginTop: "10px",
    width:"100%",
    backgroundColor:"#3baea0"
  },
};

export default Comments;
