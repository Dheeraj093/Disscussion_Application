import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

const containerStyle = {
  marginTop: '4rem',
  width: '80%',  
  margin: '0 auto',  
};

const inputPostStyle = { 
   border: '1px solid #ced4da', 
   backgroundColor: '#bae5d5', 
   borderRadius: '0.25rem', 
   padding: '1rem', 
   marginBottom:'30px',
   border:'2px solid #6a5acd'
}

const inputStyle = {
  marginBottom: '0.5rem',
  width: '100%',
  padding: '0.375rem 0.75rem',
  fontSize: '1rem',
  lineHeight: '1.5',
  color: '#495057',
  backgroundColor: '#fff',
  backgroundClip: 'padding-box',
  border: '1px solid #ced4da',
  borderRadius: '0.25rem',
};

const buttonStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  lineHeight: '1.5',
  borderRadius: '0.25rem',
  cursor: 'pointer',
};

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('https://discussionforum.onrender.com/post/getAllPosts', {
          headers: {
            Authorization: `${loggedInUser.token}`,
          },
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [loggedInUser]);

  const handlePostSubmit = async () => {
    try {
      const response = await axios.post('https://discussionforum.onrender.com/post/createPost', {
        headers: {
          Authorization: `${loggedInUser.token}`,
        },
        title: newPostTitle,
        content: newPostContent,
      });
      setPosts((prevPosts) => [response.data.post, ...prevPosts]);

      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error('Error posting new post:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={inputPostStyle}>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handlePostSubmit} style={buttonStyle}>
          Post
        </button>
      </div>

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
