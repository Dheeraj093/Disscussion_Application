const Comment = require('../Models/Comment');
const Reply = require('../Models/Reply');
const User = require('../Models/User');
const Post = require('../Models/Post');
const {SendMail} = require("../Config/SendMail")

const replyToComment = async (req, res) => {
  try {
    const { content, commentID } = req.body;

    const parentComment = await Comment.findOne({ _id: commentID });

    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newReply = new Reply({
      content,
      userID: user._id,
      commentID,
    });

    await newReply.save();

    // Send emails to users
    const post = await Post.findById(parentComment.postID);
    const postCreator = await User.findById(post.userID);
    const originalCommenter = await User.findById(parentComment.userID);

    if (postCreator) {
      const postCreatorEmailSubject = 'New Reply Notification';
      const postCreatorEmailContent = `
        <p>Hello ${postCreator.name},</p>
        <p>${user.name} are replying on your post "${post.title}".</p>
        <p>Check it out on the forum!</p>
      `;

      await SendMail(postCreator.email, postCreatorEmailSubject, postCreatorEmailContent);
    }

    if (originalCommenter) {
      const originalCommenterEmailSubject = 'New Reply Notification';
      const originalCommenterEmailContent = `
        <p>Hello ${originalCommenter.name},</p>
        <p>${user.name} replied to your comment on "${post.title}".</p>
        <p>Check it out on the forum!</p>
      `;

      await SendMail(originalCommenter.email, originalCommenterEmailSubject, originalCommenterEmailContent);
    }

    res.status(201).json({
      message: 'Reply posted successfully',
      reply: {
        _id: newReply._id,
        content: newReply.content,
        userID: newReply.userID,
        commentID: newReply.commentID,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllRepliesAtComment = async (req, res) => {
  try {
    const commentID = req.body.commentID;  
    const commentReplies = await Reply.find({commentID: commentID });

    res.status(200).json({
      message: 'All replies at the comment fetched successfully',
      replies: commentReplies,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { replyToComment, getAllRepliesAtComment};
