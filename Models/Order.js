const Sequelize = require("sequelize");

const sequelize = require("../StartUp/db");

const Order = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  order_status: {
    type: Sequelize.ENUM,
    values: ["Confirmed", "Pending", "Canceled"],
    allowNull: false,
  },
});

module.exports = Order;
