const express = require("express");
const cors = require("cors");

const sequelize = require("./StartUp/db");
const Product = require("./Models/Product");
const { User } = require("./Models/User");
const Order = require("./Models/Order");
const Cart = require("./Models/Cart");

const products = require("./routes/products");
const users = require("./routes/users");
const cart = require("./routes/cart");
const transaction = require("./routes/transaction");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/products", products);
app.use("/api/users", users);
app.use("/api/cart", cart);
app.use("/api/transaction", transaction);
app.use("/api/orders", orders);

Product.hasMany(Cart, { constraints: true, onDelete: "CASCADE" });
Order.hasMany(Cart, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Order);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });
