// import jwt from 'jsonwebtoken';
// import { User } from '../models/User.js';

// export const isAuth = async(req,res,next) => {
//     try {
//         const {token} = req.headers

//         if(!token) return res.status(403).json({
//             message: "Please login",
//         });

//         const decodedData = jwt.verify(token, process.env.JWT_SEC);
        
//         req.user = await User.findById(decodedData._id);

//         next();

//     } catch (error) {
//         res.status(500).json({
//             message: "Please login",
//         });
//     }
// }



























import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login",
      });
    }

    if (!process.env.JWT_SEC) {
      console.error("JWT_SEC is missing in environment variables");

      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    const user = await User.findById(decodedData._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};