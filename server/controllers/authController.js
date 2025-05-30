// // const axios = require('axios');
// // const jwt = require('jsonwebtoken');
// // const { oauth2Client } = require('../utils/googleClient');
// // const User = require('../models/userModel');

// // /* GET Google Authentication API. */
// // // exports.googleAuth = async (req, res, next) => {
// // //     const code = req.query.code;
// // //     if (!code) {
// // //         return res.status(400).json({ message: "Authorization code is missing" });
// // //     }
// // //     try {
// // //         console.log("Received code:", code);
// // //         const googleRes = await oauth2Client.getToken(code);
// // //         console.log("Google tokens:", googleRes.tokens);
// // //         oauth2Client.setCredentials(googleRes.tokens);

// // //         const userRes = await axios.get(
// // //             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
// // //         );
// // //         console.log("User info:", userRes.data);

// // //         const { email, name, picture } = userRes.data;
// // //         let user = await User.findOne({ email });

// // //         if (!user) {
// // //             user = await User.create({
// // //                 name,
// // //                 email,
// // //                 image: picture,
// // //             });
// // //         }
// // //         const { _id } = user;
// // //         const token = jwt.sign({ _id, email },
// // //             process.env.JWT_SECRET, {
// // //             expiresIn: process.env.JWT_TIMEOUT,
// // //         });
// // //         res.status(200).json({
// // //             message: 'success',
// // //             token,
// // //             user,
// // //         });
// // //     } catch (err) {
// // //         console.error("Error during Google Auth:", err);
// // //         res.status(500).json({
// // //             message: "Internal Server Error",
// // //             error: err.message,
// // //         });
// // //     }
// // // };


// // // exports.googleAuth = async (req, res, next) => {
// // //     const code = req.query.code;
// // //     if (!code) {
// // //         return res.status(400).json({ message: "Authorization code is missing" });
// // //     }
// // //     try {
// // //         console.log("Received code:", code);
// // //         const googleRes = await oauth2Client.getToken(code);
// // //         console.log("Google tokens:", googleRes.tokens);
// // //         oauth2Client.setCredentials(googleRes.tokens);

// // //         const userRes = await axios.get(
// // //             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
// // //         );
// // //         console.log("User info:", userRes.data);

// // //         const { email, name, picture } = userRes.data;

// // //         let user = await User.findOne({ email });

// // //         if (!user) {
// // //             user = await User.create({
// // //                 name,
// // //                 email,
// // //                 image: picture,
// // //                 allowed: false, // New users are not allowed by default
// // //             });
// // //         }

// // //         // Check if the user is allowed to log in
// // //         if (!user.allowed) {
// // //             return res.status(403).json({ message: "Access denied. You are not allowed to log in." });
// // //         }

// // //         const { _id, role } = user;
// // //         const token = jwt.sign({ _id, email, role },
// // //             process.env.JWT_SECRET, {
// // //             expiresIn: process.env.JWT_TIMEOUT,
// // //         });
// // //         res.status(200).json({
// // //             message: 'success',
// // //             token,
// // //             user,
// // //         });
// // //     } catch (err) {
// // //         console.error("Error during Google Auth:", err);
// // //         res.status(500).json({
// // //             message: "Internal Server Error",
// // //             error: err.message,
// // //         });
// // //     }
// // // };

// // exports.googleAuth = async (req, res, next) => {
// //     const code = req.query.code;
// //     if (!code) {
// //         return res.status(400).json({ message: "Authorization code is missing" });
// //     }
// //     try {
// //         console.log("Received code:", code);
// //         const googleRes = await oauth2Client.getToken(code);
// //         console.log("Google tokens:", googleRes.tokens);
// //         oauth2Client.setCredentials(googleRes.tokens);

// //         const userRes = await axios.get(
// //             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
// //         );
// //         console.log("User info:", userRes.data);

// //         const { email, name, picture } = userRes.data;

// //         let user = await User.findOne({ email });

// //         // If the user is not found in the database
// //         if (!user) {
// //             return res.status(403).json({ message: "Access denied. Email not recognized." });
// //         }

// //         // Check if the user is allowed to log in
// //         if (!user.allowed) {
// //             return res.status(403).json({ message: "Access denied. You are not allowed to log in." });
// //         }

// //         const { _id, role } = user;
// //         const token = jwt.sign({ _id, email, role },
// //             process.env.JWT_SECRET, {
// //             expiresIn: process.env.JWT_TIMEOUT,
// //         });
// //         res.status(200).json({
// //             message: 'success',
// //             token,
// //             user,
// //         });
// //     } catch (err) {
// //         console.error("Error during Google Auth:", err);
// //         res.status(500).json({
// //             message: "Internal Server Error",
// //             error: err.message,
// //         });
// //     }
// // };

// // // exports.googleAuth = async (req, res, next) => {
// // //     const code = req.query.code;
// // //     if (!code) {
// // //         return res.status(400).json({ message: "Authorization code is missing" });
// // //     }
// // //     try {
// // //         const googleRes = await oauth2Client.getToken(code);
// // //         oauth2Client.setCredentials(googleRes.tokens);

// // //         const userRes = await axios.get(
// // //             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
// // //         );

// // //         const { email, name, picture } = userRes.data;

// // //         let user = await User.findOne({ email });

// // //         // If the user is not found in the database
// // //         if (!user) {
// // //             return res.status(403).json({ message: "Access denied. Email not recognized." });
// // //         }

// // //         // Check if the user is allowed to log in
// // //         if (!user.allowed) {
// // //             return res.status(403).json({ message: "Access denied. You are not allowed to log in." });
// // //         }

// // //         const { _id, role } = user;
// // //         const token = jwt.sign({ _id, email, role }, process.env.JWT_SECRET, {
// // //             expiresIn: process.env.JWT_TIMEOUT,
// // //         });

// // //         res.status(200).json({
// // //             message: "success",
// // //             token,
// // //             user,
// // //         });
// // //     } catch (err) {
// // //         console.error("Error during Google Auth:", err);
// // //         res.status(500).json({
// // //             message: "Internal Server Error",
// // //             error: err.message,
// // //         });
// // //     }
// // // };

// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const { oauth2Client } = require('../utils/googleClient');
// const User = require('../models/userModel');

// /* GET Google Authentication API. */
// exports.googleAuth = async (req, res, next) => {
//     const code = req.query.code;
//     if (!code) {
//         return res.status(400).json({ message: "Authorization code is missing" });
//     }
//     try {
//         console.log("Received code:", code);
//         const googleRes = await oauth2Client.getToken(code);
//         console.log("Google tokens:", googleRes.tokens);
//         oauth2Client.setCredentials(googleRes.tokens);

//         const userRes = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//         );
//         console.log("User info:", userRes.data);

//         const { email, name, picture } = userRes.data;
//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 image: picture,
//             });
//         }
//         const { _id } = user;
//         const token = jwt.sign({ _id, email },
//             process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_TIMEOUT,
//         });
//         res.status(200).json({
//             message: 'success',
//             token,
//             user,
//         });
//     } catch (err) {
//         console.error("Error during Google Auth:", err);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: err.message,
//         });
//     }
// };

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../utils/googleClient');
const User = require('../models/userModel');

// Hardcoded allowed emails (move to env or DB in production)
const allowedEmails = [
  "pontaganikavitha75@gmail.com",
  "kpontagani@gmail.com",
  "kavithaggphotos@gmail.com",
];

exports.googleAuth = async (req, res, next) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ message: "Authorization code is missing" });
  }

  try {
    console.log("Received code:", code);
    const googleRes = await oauth2Client.getToken(code);
    console.log("Google tokens:", googleRes.tokens);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    console.log("User info:", userRes.data);

    const { email, name, picture } = userRes.data;

    // // 🚫 Deny access if not in allowed list
    // if (!allowedEmails.includes(email)) {
    //   return res.status(403).json({
    //     message: "Access denied. This email is not authorized.",
    //     email
    //   });
    // }

    // // Continue with login or registration
    // let user = await User.findOne({ email });

    // if (!user) {
    //   user = await User.create({
    //     name,
    //     email,
    //     image: picture,
    //   });
    // }

    // ✅ Check if user exists in DB and is allowed
    let user = await User.findOne({ email });

    if (!user || !user.allowed) {
      return res.status(403).json({
        message: "Access denied. This email is not authorized.",
        email,
      });
    }

    // Create user if not exists and mark as not allowed (optional)
    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        allowed: false, // must be manually allowed from Admin panel later
      });

      return res.status(403).json({
        message: "User created but not yet allowed to log in",
        email,
      });
    }

    const { _id } = user;
    const token = jwt.sign(
      { _id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );

    res.status(200).json({
      message: 'success',
      token,
      user,
    });

  } catch (err) {
    console.error("Error during Google Auth:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
