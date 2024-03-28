const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const createJwtToken = require("./token");

// database connection
connectToMongo();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

// availabel routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/verifications", require("./routes/verifications"));
//email sending
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,//sender gmail
    pass: process.env.APP_PASS,//app password from gmail account
  },
  secure: true,
});

app.get("/users/all", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json({ users: allUsers });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.get("/users/single", async (req, res) => {
  try {
    const user = await User.findById(req.body.id).select("-password");
    const token = createJwtToken(user);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.post("/api/user/mail", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email,
    }).select("-password");
    const token = createJwtToken(user._id);
    const mailData = {
      from: process.env.USER, // sender address
      to: email, // list of receivers
      subject: "Sending Email using Node.js",
      text: "That was easy!",
      html: `
      link - ${process.env.FRONTEND_URL}/resetpassword?token=${token}
      `,
    };
    transporter.sendMail(mailData);
    // const user = await User.findById(req.body.id).select("-password");
    // const token = createJwtToken(user);
    res.json({ message: "Email Sent Successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/api/user/validate", async (req, res) => {
  console.log("t1");
  try {
    console.log("t2");
    const token = req.query.token;
    const payload = jwt.verify(token, "ASIUDOASNDUH(*@HQIENDQ");
    const user = await User.findById(payload.user).select("-password");

    console.log(user);
    user.password = req.body.password;
    console.log("user");
    user.save();
    res.json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});
//
app.listen(port, () => {
  console.log(`inotebook backend listening at http://localhost:${port}`);
});
