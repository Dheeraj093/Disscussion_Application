const express = require("express");
const {createPost, getPostsByUser, getAllPosts} = require("../Controllers/Post");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/createPost",protect,createPost);
router.post("/getAllPosts",protect,getAllPosts);
router.post("/getPostsByUser",protect,getPostsByUser);

module.exports = router;