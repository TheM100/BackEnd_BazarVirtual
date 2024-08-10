const express = require("express");
const router = express.Router();
const {
  postNewPurchase,
  getFromClient,
  getFromBrand,
  deliveredTrue,
} = require("../controllers/ordersControllers");

router.get("/clientOrders/:clientId", getFromClient);
router.get("/brandSales/:brandId", getFromBrand);
router.post("/newOrder", postNewPurchase);
router.put("/deliveredProduct", deliveredTrue);

module.exports = router;
