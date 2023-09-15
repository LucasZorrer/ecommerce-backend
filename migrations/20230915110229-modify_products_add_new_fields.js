'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
        onDelete: "CASCADE"
      }
    })
    queryInterface.addColumn('Products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
        onDelete: "CASCADE"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Products', 'user_id'),
      queryInterface.removeColumn('Products', 'category_id'),
    ]);
  }
};
