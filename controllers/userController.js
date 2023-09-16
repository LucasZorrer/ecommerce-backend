// controllers/userController.js
const yup = require("yup");
const bcrypt = require('bcrypt')
const {User} = require("../models");

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

module.exports = {
  createUser,
};
