import React, { useEffect, useState } from 'react';
import Comment from './Comment';  
import axios from 'axios';
import styled from 'styled-components';  
import { useSelector } from 'react-redux';


const Reply = ({ commentID, isReply = false }) => {
  const [replies, setReplies] = useState([]);
  const [newReplyText, setNewReplyText] = useState('');
  const [toggleReplyButtons, setToggleReplyButtons] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.post(`https://discussionforum.onrender.com/reply/getAllRepliesAtComment`, {
          headers: {
            Authorization: `${loggedInUser.token}`,
          },
          commentID,
        });
        setReplies((prev) => res.data.replies);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReplies();
  }, [commentID, loggedInUser]);

  const handleReplySubmission = async () => {
    if (!loggedInUser) {
      console.log('Sign In required!');
      setToggleReplyButtons(false);
      return;
    }
    try {
      const res = await axios.post(`https://discussionforum.onrender.com/reply/replyToComment`, {
        headers: {
          Authorization: `${loggedInUser.token}`,
        },
        commentID,
        content: newReplyText,
      });
      setReplies((prev) => [...prev, res.data.reply]);
      setNewReplyText('');
      setToggleReplyButtons(false);
      setShowReplies(true);
    } catch (error) {
      console.log(error);
      console.log('Unable to post a reply');
    }
  };

  const handleCancel = () => {
    setNewReplyText('');
    setToggleReplyButtons(false);
  };

  return (
    <Container>
      {!isReply && loggedInUser && (
        <>
          <div>
            <TextArea
              placeholder="Add a reply..."
              value={newReplyText}
              onChange={(e) => setNewReplyText(e.target.value)}
              onFocus={() => setToggleReplyButtons(true)}
            />
          </div>
          <div>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <ReplyButton onClick={handleReplySubmission}>Reply</ReplyButton>
          </div>
        </>
      )}

      {showReplies ? (
        <>
          <HideRepliesButton onClick={() => setShowReplies(false)}>Hide Replies</HideRepliesButton>
          {replies.length > 0 ? (
            replies.map((reply) => <Comment comment={reply} isComment={false} />)
          ) : (
            <NoReplies>No Replies for this comment</NoReplies>
          )}
        </>
      ) : (
        <ShowRepliesButton onClick={() => setShowReplies(true)}>Show Replies</ShowRepliesButton>
      )}
    </Container>
  );
};

export default Reply;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #c7f3ff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-left: 30px;  
`;

const TextArea = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

const CancelButton = styled.button`
  background: #ea8a8a;
  border: none;
  color: #333;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const ReplyButton = styled.button`
  background: #6db193;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
`;

const ShowRepliesButton = styled.button`
  background: #927fbf;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const HideRepliesButton = styled.button`
  background: #3baea0;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const NoReplies = styled.span`
  color: #777;
`;
