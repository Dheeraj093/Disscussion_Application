import React, { useEffect, useState } from 'react';
import Comments from './Comments'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const PostCard = ({ post }) => {
  const [user, setUser] = useState(null);
  const loggedInUser = useSelector((state) => state.user.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(`https://discussionforum.onrender.com/user/${post.userID}`, {
          headers: {
           Authorization: `${loggedInUser.token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [post.userId]);

  return (
    <div className="card mb-4" style={styles.postCard}>
       
      <div className="card-header bg-light" style={styles.userNameContainer}>
        {user && <h3>{user.name}</h3>}
      </div>

      
      <div className="card-body" style={styles.postContentContainer}>
        <h2 className="card-title">{post.title}</h2>
        <p className="card-text">{post.content}</p>
        
      </div>

       
      <div className="card-footer bg-light" style={styles.commentsContainer}>
        <Comments postID={post._id} />
      </div>
    </div>
  );
};

const styles = {
  postCard: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  userNameContainer: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  postContentContainer: {
    marginBottom: '20px',
  },
  commentsContainer: {
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default PostCard;
