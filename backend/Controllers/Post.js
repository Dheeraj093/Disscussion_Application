const Post = require('../Models/Post');
const User = require('../Models/User');
const {SendMail} = require("../Config/SendMail")



const createPost =  async (req, res) => {
  // console.log(req.body)
  try {
    const { title, content } = req.body;
    const userID = req.user._id;
    const user = await User.findById(req.user._id);

    const newPost = new Post({
      title,
      content,
      userID
    });

    await newPost.save();
    
    const postAuthorEmail = user.email;

    const emailSubject = 'New Post Notification';
    const emailContent = `
      <p>Hello ${user.name},</p>
      <p>Congrats your post is live now</p>
      <p>Check it out on the forum!</p>
    `;

    await SendMail(postAuthorEmail, emailSubject, emailContent);

    res.status(201).json({
      message: 'Discussion posted successfully Created',
      post: {
        _id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        userID:newPost.userID,  
      },
    });

    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();

    res.status(200).json({
      message: 'All posts fetched successfully',
      posts: allPosts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.user._id;  

    const userPosts = await Post.find({ userID: userId });

    res.status(200).json({
      message: 'User posts fetched successfully',
      posts: userPosts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createPost,getAllPosts,getPostsByUser};
