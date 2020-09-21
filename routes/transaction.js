const router = require("express").Router();

const auth = require("../middleware/auth");

const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const Product = require("../Models/Product");

router.get("/", auth, async (req, res) => {
  let cartResultArray = [];
  let productResultArray = [];

  //finding from a order table
  const orderResult = await Order.findAll({
    where: { userId: req.user.userId },
  });

  //finding from a cart table using order id
  for (let i = 0; i < orderResult.length; i++) {
    let oid = orderResult[i].id;
    const cartResult = await Cart.findOne({ where: { orderId: oid } });
    cartResultArray.push(cartResult);
  }

  //finding from a product table

  for (let i = 0; i < cartResultArray.length; i++) {
    let pid = cartResultArray[i].productId;
    let oid = cartResultArray[i].orderId;
    const productResult = await Product.findOne({ where: { id: pid } });
    productResult["dataValues"]["orderId"] = oid;

    productResultArray.push(productResult);
  }

  res.status(200).send(productResultArray);
});

module.exports = router;
