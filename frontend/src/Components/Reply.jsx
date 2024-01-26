import React, { useEffect, useState } from 'react';
import Comment from './Comment';  
import axios from 'axios';
import styled from 'styled-components';  
import { useSelector } from 'react-redux';

 
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f2f2f2;
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
  background: #ff9999;
  border: none;
  color: #333;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const ReplyButton = styled.button`
  background: #4caf50;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
`;

const NoReplies = styled.span`
  color: #777;
`;

const styles = {
  textArea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  cancelButton: {
    background: '#ff9999',
    border: 'none',
    color: '#333',
    padding: '8px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  replyButton: {
    background: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '8px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noReplies: {
    color: '#777',
  },
};

const Reply = ({ commentID, isReply = false }) => {
  const [replies, setReplies] = useState([]);
  const [newReplyText, setNewReplyText] = useState('');
  const [toggleReplyButtons, setToggleReplyButtons] = useState(false);
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/reply/getAllRepliesAtComment`, {
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

  const handleReplySubmission = async (e) => {
    if (!loggedInUser) {
      console.log('Sign In required!');
      setToggleReplyButtons(false);
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/reply/replyToComment`, {
        headers: {
          Authorization: `${loggedInUser.token}`,
        },
        commentID,
        content: newReplyText,
      });
      setReplies((prev) => [...prev, res.data.reply]);
      setNewReplyText('');
      setToggleReplyButtons(false);
    } catch (error) {
      console.log(error);
      console.log('Unable to post a reply');
    }
  };

  const handleCancel = (e) => {
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
              onFocus={(e) => setToggleReplyButtons(true)}
            />
          </div>
          <div>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <ReplyButton onClick={handleReplySubmission}>Reply</ReplyButton>
          </div>
        </>
      )}

      {replies.length > 0 ? (
        replies.map((reply) => <Comment comment={reply} isComment={false} />)
      ) : (
        <NoReplies>No Replies for this comment</NoReplies>
      )}
    </Container>
  );
};

export default Reply;
