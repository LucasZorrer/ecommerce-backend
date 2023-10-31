require("dotenv").config();

module.exports = {
  development: {
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5433,
    username: "postgres",
    password: "postgres",
    database: "database_development",
  },
  test: {
    dialect: "postgres",
    host: "127.0.0.1:5132",
    username: "postgres",
    password: "postgres",
    database: "database_test",
  },
  production: {
    dialect: "postgres",
    host: "127.0.0.1:5132",
    username: "postgres",
    password: "postgres",
    database: "database_production",
  },
};
