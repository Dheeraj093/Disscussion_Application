const express = require("express");
const { commentAtPost, getAllCommentsAtPost } = require("../Controllers/Comment");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/commentAtPost",protect,commentAtPost);
router.post("/getAllCommentsAtPost",protect,getAllCommentsAtPost);

module.exports = router;