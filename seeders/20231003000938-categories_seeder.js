"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Categories", [
      {
        name: "Sports",
        description: "All about Sports.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Clothes",
        description: "All about clothes.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tecnology",
        description: "All about computers, notebooks, smartphones, etc.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  },
};
