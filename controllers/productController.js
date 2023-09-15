const yup = require("yup");
const Product = require("../models/product");

const create = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
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
    });

    const data = { name, description, price, category_id };

    await schema.validate(data);
    console.log(req.user)
    // // const product = await Product.create({
    // //   name,
    // //   description,
    // //   price,
    // //   category_id,
    // // });
    // res.status(201).json({
    //   message: "Product created successfully",
    //   product,
    // });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

module.exports = {
  create,
};
