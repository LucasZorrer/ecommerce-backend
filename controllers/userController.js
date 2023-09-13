const yup = require("yup");

const UserController = {
  async createUser(req, res) {
    const userData = req.body;
    const schema = yup.object().shape({
      password: yup
        .string("Enter a password.")
        .required("Enter a password.")
        .min(6, "Make a stronger password."),
      email: yup
        .string("Enter your email.")
        .required("Enter your email.")
        .email("Enter a valid email."),
      name: yup
        .string("Enter your name.")
        .required("Enter your name."),
    });

    try {
      await schema.validate(userData);
    } catch (err) {
      return res.status(400).json({
        message: err.errors,
      });
    }

    res
      .status(201)
      .json({ message: "User successfully created", user: userData });
  },
};

module.exports = UserController;
