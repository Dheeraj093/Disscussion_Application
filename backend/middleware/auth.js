const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // console.log(req.body);
    // const token = req.headers.token;
    const token = req.body.headers.Authorization;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { _id: decoded._id };
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = protect;
