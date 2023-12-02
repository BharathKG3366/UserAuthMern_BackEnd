const User = require("../models/User");
const { sendMail } = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://auth-backend-07cl.onrender.com/signin/${token}`; //yet to be added
    const content = `<h4> Hi, there </h4>
        <h5>Welcome to the app</h5>
        <p>Thankyou For Signing up. Click the below link to activate</p>
        <a href="${activationLink}>Click Here</a>
        <p>Regards</P>
        <p>Team</p>`;
    console.log(newUser);

    await newUser.save();
    sendMail(email, "verifyUser", content);
  } catch (error) {
    console.log(error);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

async function InsertSignUpUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetpassword: userVerify.forgetpassword,
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4> Hi, there Regestration Successful </h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered</p>
        <p>Regards</p>
        <p>Team</p>`;
      sendMail(newUser.email, "Regestration successful", content);
      return `<h4> Hi, there </h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered</p>
        <p>Regards</p>
        <p>Team</p>`;
    }
    return `<h4> Registration Failed </h4>
    <p>Link expired...</p>
    <p>Regards</p>
    <p>Team</p>`;
  } catch (error) {
    console.log(error);
    return `<html>
        <body>
        <h4> Registration Failed </h4>
        <p>Unexpected error happened...</p>
        <p>Regards</p>
        <p>Team</p>
        </body></html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };
