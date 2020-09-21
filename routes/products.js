const router = require("express").Router();
const Product = require("../Models/Product");
const auth = require("../middleware/auth");

router.post("/", (req, res) => {
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const imageUrl = req.body.imageUrl;

  const product = Product.create({
    product_name: productName,
    product_price: productPrice,
    imageUrl: imageUrl,
  })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/", auth, (req, res) => {
  Product.findAll()
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
