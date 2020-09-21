const router = require("express").Router();

const auth = require("../middleware/auth");

const Order = require("../Models/Order");

router.put("/", auth, async (req, res) => {
  const oid = req.body.oid;

  Order.update({ order_status: "Confirmed" }, { where: { id: oid } })
    .then((result) => res.status(200).send({ updated: true }))
    .catch((err) => res.status(400).send({ updated: false }));
});

module.exports = router;
