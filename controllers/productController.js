const yup = require("yup");
const { Product, Category } = require("../models");

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

const listProduct = async (req, res) => {
  console.log(req.params);
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });

    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(200).json({ success: false, message: "Product Not Found." });
    }
  } catch (err) {
    console.log(err);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ attributes: ["id", "name"] });

    res.json({ success: true, categories });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  create,
  listAll,
  listProduct,
  getCategories,
};
