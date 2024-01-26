// PostList.js
import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const loggedInUser = useSelector((state) => state.user.user);
  console.log("loggedInUser",loggedInUser)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('http://localhost:5000/post/getAllPosts', {
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
      const response = await axios.post('http://localhost:5000/post/createPost', {
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
    <div className="container mt-4">
       
      <div className="mb-4 p-3 border bg-light rounded">
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="form-control mb-2"
        />
        <textarea
          placeholder="Content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={handlePostSubmit} className="btn btn-success">
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
