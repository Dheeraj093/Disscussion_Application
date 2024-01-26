const User = require('../Models/User');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const { generateOTP, generateMailTransporter } = require('../Config/mail');

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      throw new Error("Email is already in use!!!");
    }

    let OTP = generateOTP();

    // Hash the OTP before saving it to the database
    const hashedOTP = await bcryptjs.hash(OTP, 10);

    const newUser = new User({
      name,
      email,
      password: hashedOTP,
    });

    await newUser.save();

    var transport = generateMailTransporter();

    transport.sendMail({
      from: 'verification@reviewApp.com',
      to: newUser.email,
      subject: 'Email Verification',
      html: `
        <p>Your verification OTP<p>
        <h1>${OTP}<h1>
      `,
    });

    res.status(201).json({ message: "OTP sent successfully", user: newUser.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found!');
    }

    // Compare the hashed OTP with the provided OTP
    const isOTPValid = await bcryptjs.compare(otp, user.password);

    if (!isOTPValid) {
      throw new Error('Invalid OTP!');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


const loginUser= async (req, res) => {
  try {
    const { email } = req.body;

    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new Error("Email is not registered!!!");
    }

    let OTP = generateOTP();

    // Hash the OTP before saving it to the database
    const hashedOTP = await bcryptjs.hash(OTP, 10);
    existUser.password = hashedOTP;
    await existUser.save();
    var transport = generateMailTransporter();

    transport.sendMail({
      from: 'verification@reviewApp.com',
      to: existUser.email,
      subject: 'Email Verification',
      html: `
        <p>Your verification OTP<p>
        <h1>${OTP}<h1>
      `,
    });

    res.status(201).json({ message: "OTP sent successfully", user: existUser.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userID = req.params.userID; // Assuming you pass the user ID in the URL
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = { registerUser, verify,loginUser,getUserById};
