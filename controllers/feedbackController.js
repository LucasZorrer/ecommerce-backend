const { Feedback, User } = require("../models");

const create = async (req, res) => {
  try {
    const { comment, product_id } = req.body;
    const user_id = req.user.user;

    const createdFeedback = await Feedback.create({
      comment,
      product_id,
      user_id,
    });

    const userName = await User.findOne({
      where: {
        id: user_id,
      },
    });

    const newFeedback = {
      ...createdFeedback.get(),
      user: userName ? userName.get().name : null,
    };

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      newFeedback,
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({
      success: false,
      message: error,
    });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: {
        product_id: parseInt(req.params.productId),
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const formattedFeedbacks = await Promise.all(
      feedbacks.map(async (feedback) => {
        const user = await User.findOne({
          where: {
            id: feedback.user_id,
          },
          attributes: ["name"],
        });

        return {
          ...feedback.get(),
          user: user.get().name,
        };
      })
    );

    res.status(201).json({
      success: true,
      feedbacks: formattedFeedbacks,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const user_id = req.user.user;
    const feedbackId = req.params.feedbackId;

    const deletedFeedback = await Feedback.destroy({
      where: {
        id: feedbackId,
        user_id,
      },
    });
    res.status(201).json({
      success: true,
      message: "Feedback successfully removed",
      deletedFeedback,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  create,
  getFeedbacks,
  deleteFeedback,
};
