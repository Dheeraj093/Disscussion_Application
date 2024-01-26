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
  background-color: #aedadd;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin:10px;
`;

const CommentContainer = styled.div`
   border: 1px solid #3fc5f0;
   border-radius: 8px;
    background-color: #ace7ef;
   padding:10px;
`

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
          const response = await axios.post(`https://discussionforum.onrender.com/user/${comment.userID}`, {
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
     <CommentContainer>
      <CommentHeader>
        <strong>{user.name}</strong>
        <span>
          {/* {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })} */}
        </span>
      </CommentHeader>
      <CommentText>{comment.content}</CommentText>
      </CommentContainer>
      {isComment && <Reply commentID={comment._id} />}
    </Container>
  );
};

export default Comment;
