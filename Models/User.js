const Sequelize = require("sequelize");
const Joi = require("joi");

const sequelize = require("../StartUp/db");

const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

async function validateUsers(user) {
  const schema = Joi.object({
    userName: Joi.string()
      .trim()
      .regex(/^[A-Za-z ]+$/)
      .required(),
    userEmail: Joi.string()
      .trim()
      .email()
      .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .required(),
    userPassword: Joi.string().trim().min(5).max(8).required(),
    userAddress: Joi.string().trim().required(),
  });

  // console.log(Joi);

  // console.log("JOI: ", schema.validate(user));

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUsers;
