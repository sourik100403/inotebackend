const { body, validationResult } = require("express-validator");
const express = require("express");
const User = require("../models/User");
const OTP = require("../models/OTP");
var nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,//sender gmail
    pass: process.env.APP_PASS,//app password from gmail account
  },
  secure: true,
});

router.get("/checkUser", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (user) res.json({ success: false, error: "Email already registered" });
    else res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error);
  }
});

router.get("/sendOtp", async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const updatedOTP = await OTP.findOneAndUpdate(
    { email: req.query.email },
    { email: req.query.email, otp: otp },
    { upsert: true, new: true }
  );
  try {
    const mailData = {
      from:process.env.USER,
      to: req.query.email,
      subject: "[Euphonic] Verify Your Mail",
      text: "Your OTP is",
      html: `
            Your OTP is <b><span>${otp}</span></b>
            `,
    };
    transporter.sendMail(mailData);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ message: "Email and OTP are required" });
    }
    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc) {
      return res.json({ message: "OTP Expired" });
    }
    if (otpDoc.otp !== otp) {
      return res.json({ message: "Invalid OTP" });
    }
    await OTP.deleteOne({ email });
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
