const Comment = require('../Models/Comment');
const Post = require('../Models/Post');
const User = require('../Models/User');
const {SendMail} = require("../Config/SendMail")

const commentAtPost = async (req, res) => {
  try {
    const { content, postID } = req.body;
    const post = await Post.findOne({ _id: postID });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newComment = new Comment({
      content,
      postID: post._id,
      userID: user._id,
    });

    await newComment.save();

    const postCreator = await User.findById(post.userID);
    if (postCreator) {
      const emailSubject = 'New Comment Notification';
      const emailContent = `
        <p>Hello ${postCreator.name},</p>
        <p>${user.name} commented on your post "${post.title}".</p>
        <p>Check it out on the forum!</p>
      `;

      await SendMail(postCreator.email, emailSubject, emailContent);
    }
    res.status(201).json({
      message: 'Comment posted successfully',
      comment: {
        _id: newComment._id,
        content: newComment.content,
        post: newComment.postID,
        user: newComment.userID,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getAllCommentsAtPost = async (req, res) => {
  try {
    const postID = req.body.postID;  
    const postComments = await Comment.find({ postID: postID });

    res.status(200).json({
      message: 'All comments at the post fetched successfully',
      comments: postComments,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { commentAtPost, getAllCommentsAtPost };
