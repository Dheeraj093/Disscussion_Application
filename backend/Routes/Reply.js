const express = require("express");
const { replyToComment, getAllRepliesAtComment } = require("../Controllers/Reply");
const protect = require("../middleware/auth");

const router = express.Router();

router.post('/replyToComment', protect, replyToComment);
router.post('/getAllRepliesAtComment', protect, getAllRepliesAtComment);

module.exports = router;