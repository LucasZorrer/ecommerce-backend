// controllers/userController.js
const yup = require("yup");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();


const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshToken)
  if (refreshToken == null)
    return res.sendStatus(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken))
    return res.sendStatus(403).json("Refresh token is not valid!");

  if (res.headersSent) {
    return;
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
}

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const schema = yup.object().shape({
      password: yup
        .string("Enter a password.")
        .required("Enter a password.")
        .min(6, "Make a stronger password."),
      email: yup
        .string("Enter your email.")
        .required("Enter your email.")
        .email("Enter a valid email."),
      name: yup.string("Enter your name.").required("Enter your name."),
    });



    await schema.validate(req.body);
    const hashedPassword = await bcrypt.hash(password, 10)


    const existingUser = await User.findOne({
      where: {
        name
      },
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.name === name) {
        errors.push('Username already exists');
      }
      if (existingUser.email === email) {
        errors.push('Email already exists');
      }

      res.status(201).json({ success: false, message: errors.join(', ') });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

let refreshTokens = [];
const loginUser = async (req, res) => {

  const { email, password } = req.body;
  if (email === undefined) {
    res.status(201).json({ success: false, message: "Enter an email" });
    return;
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || user === undefined) {
      res.status(201).json({ success: false, message: "Email not registered" });
      return;
    }

    const hashedPassword = user.password;
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        return err;
      }
      if (isMatch) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = jwt.sign(
          user.id,
          process.env.REFRESH_TOKEN_SECRET
        );
        refreshTokens.push(refreshToken);
        res.status(201).json({
          success: true,
          message: "Successfully Logged",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.status(201).json({ success: false, message: "Wrong Password." });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const logout = async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.json({ success: true, message: "Logout Successfully done"}).status(204);
}

const getUserData = async (req, res) => {
  console.log(req.user)
  const userFromServer = await User.findOne({
    where: {
      id: req.user.user,
    },
  });

  const { id, name, email } = userFromServer;
  const userData = {
    id,
    name,
    email,
  };
  res.json(userData);
}

function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
}

module.exports = {
  createUser,
  loginUser,
  getUserData,
  refreshToken,
  logout
};
