// import { OTP } from "../models/Otp.js";
// import { User } from "../models/User.js";
// import TryCatch from "../utils/TryCatch.js";
// import sendOtp from "../utils/sendOtp.js";
// import jwt from "jsonwebtoken";

// export const loginUser = TryCatch(async (req, res) => {
//   const { email } = req.body;

//   const subject = "Ecommerce App";

//   const otp = Math.floor(Math.random() * 1000000);

//   const prevOtp = await OTP.findOne({
//     email,
//   });

//   if (prevOtp) {
//     await prevOtp.deleteOne();
//   }

//   await sendOtp({ email, subject, otp });

//   await OTP.create({ email, otp });

//   res.json({
//     message: "Otp send to your mail",
//   });
// });

// export const verifyUser = TryCatch(async (req, res) => {
//   const { email, otp } = req.body;

//   const haveOtp = await OTP.findOne({
//     email,
//     otp,
//   });

//   if (!haveOtp)
//     return res.status(400).json({
//       message: "Wrong otp",
//     });

//   let user = await User.findOne({ email });

//   if (user) {
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
//       expiresIn: "15d",
//     });

//     await haveOtp.deleteOne();

//     res.json({
//       message: "User LoggedIn",
//       token,
//       user,
//     });
//   } else {
//     user = await User.create({
//       email,
//     });

//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
//       expiresIn: "15d",
//     });

//     await haveOtp.deleteOne();

//     res.json({
//       message: "User LoggedIn",
//       token,
//       user,
//     });
//   }
// });

// export const myProfile = TryCatch(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   res.json(user);
// });








import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import sendOtp from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";

// Send OTP
export const loginUser = TryCatch(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const subject = "ShopHub Login OTP";
  const otp = Math.floor(100000 + Math.random() * 900000);

  const prevOtp = await OTP.findOne({ email });

  if (prevOtp) {
    await prevOtp.deleteOne();
  }

  await sendOtp({ email, subject, otp });

  await OTP.create({ email, otp });

  res.json({ message: "OTP sent to your email" });
});

// Verify OTP and Login
export const verifyUser = TryCatch(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  const haveOtp = await OTP.findOne({ email, otp });

  if (!haveOtp) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  // Admin email should be configured in Render environment variables
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const role = email === adminEmail ? "admin" : "user";

  let user = await User.findOne({ email });

  if (user) {
    user.role = role;
    await user.save();
  } else {
    user = await User.create({
      email,
      role,
    });
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SEC,
    { expiresIn: "15d" }
  );

  await haveOtp.deleteOne();

  res.json({
    message: "User LoggedIn",
    token,
    user,
  });
});

// Get Logged-in User Profile
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});
