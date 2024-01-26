const express = require("express");
const { registerUser, verify, loginUser,getUserById } = require("../Controllers/User");

const router = express.Router();

router.post("/registerUser",registerUser)
router.post("/loginUser",loginUser)
router.post("/verify",verify)
router.post("/:userID",getUserById);


module.exports = router;