import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Reply from "./Reply";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #555;
`;

const CommentText = styled.span`
  font-size: 14px;
  margin-top: 5px;
`;

const Comment = ({ comment, isComment = true }) => {
  const [user, setUser] = useState({});
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(comment.userID){
          const response = await axios.post(`http://localhost:5000/user/${comment.userID}`, {
          headers: {
            Authorization: `${loggedInUser.token}`,
          },
        });
        setUser(response.data.user);
        }
        else{
          console.log("object",loggedInUser)
          setUser(loggedInUser.user)
        }
      } catch (error) {
        console.error('Error fetching user details for comment:', error);
      }
    };

    fetchUser();
  }, [comment.userId, loggedInUser]);

  return (
    <Container>
      <CommentHeader>
        <strong>{user.name}</strong>
        <span>
          {/* {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })} */}
        </span>
      </CommentHeader>
      <CommentText>{comment.content}</CommentText>
      {isComment && <Reply commentID={comment._id} />}
    </Container>
  );
};

export default Comment;
