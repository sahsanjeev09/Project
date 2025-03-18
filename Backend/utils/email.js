// const nodemailer = require("nodemailer");
// require('dotenv').config();

// // console.log("Email User:", process.env.EMAIL_USER);
// // console.log("Email Pass:", process.env.EMAIL_PASS);

// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//   // console.error("Email credentials are missing!");
//   process.exit(1); // Exit the process if credentials are missing
// }

// // Create a transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Function to send OTP email
// const sendOTPEmail = async (to, otp) => {
//   const mailOptions = {
//     from: `"Library App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Your OTP Code for Signup",
//     html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// // Function to send status update email
// const sendStatusUpdateEmail = async (to, subject, text) => {
//   const mailOptions = {
//     from: `"Library App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = {
//   sendOTPEmail,
//   sendStatusUpdateEmail,
// };


const nodemailer = require("nodemailer");
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Library App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code for Signup",
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send status update email
const sendStatusUpdateEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Library App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  console.log('Sending email to:', to); // Log the recipient
  console.log('Email subject:', subject); // Log the subject
  console.log('Email text:', text); // Log the text

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendOTPEmail,
  sendStatusUpdateEmail,
};
