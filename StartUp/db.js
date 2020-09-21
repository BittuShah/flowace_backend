const Sequelize = require("sequelize");

const sequelize = new Sequelize("order_management", "root", "Helloworld!1", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
