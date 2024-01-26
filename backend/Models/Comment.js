const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require:true,
      },

  
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
