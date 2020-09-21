const router = require("express").Router();

const auth = require("../middleware/auth");

const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const Product = require("../Models/Product");

router.post("/", auth, (req, res) => {
  const pid = req.body.pid;

  const order = Order.create({
    order_status: "Pending",
    userId: req.user.userId,
  })
    .then((result) => {
      return Cart.create({
        orderId: result.id,
        productId: pid,
      });
    })
    .then((cartResult) => {
      return res.status(200).send(cartResult);
    })
    .catch((err) => {
      return res.status(200).send(err);
    });
});

router.get("/", auth, async (req, res) => {
  let cartResultArray = [];
  let productResultArray = [];

  //finding from a order table
  const orderResult = await Order.findAll({
    where: { userId: req.user.userId, order_status: "Pending" },
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

router.put("/", auth, async (req, res) => {
  const oid = req.body.oid;

  Order.update({ order_status: "Canceled" }, { where: { id: oid } })
    .then((result) => res.status(200).send({ updated: true }))
    .catch((err) => res.status(400).send({ updated: false }));
});

module.exports = router;
