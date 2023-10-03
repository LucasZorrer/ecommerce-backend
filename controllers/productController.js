const yup = require("yup");
const { Product } = require("../models");

const create = async (req, res) => {
  try {
    const { name, description, price, category_id, quantity } = req.body;
    const schema = yup.object().shape({
      name: yup
        .string("Enter a valid name for your product.")
        .required("Enter a name for your product."),
      description: yup
        .string("Enter a valid description for your product")
        .required("Enter a description for your product"),
      price: yup
        .number("Enter price for your product")
        .required("Enter price description for your product"),
      category_id: yup
        .number("Enter a category for your product")
        .required("Enter a category for your product"),
      quantity: yup
        .number("Enter how many products that you have.")
        .required("Enter how many products that you have."),
    });

    await schema.validate(req.body);

    const createdProduct = await Product.create({
      name,
      description,
      price,
      category_id,
      quantity,
      user_id: req.user.user,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      createdProduct,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

const listAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  listAll,
};
