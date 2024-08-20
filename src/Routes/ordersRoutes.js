const express = require("express");
const router = express.Router();
const {
  postNewPurchase,
  getFromClient,
  getFromBrand,
  deliveredTrue,
  newPaymentIntent,
  getPaymentIntent,
} = require("../controllers/ordersControllers");

router.get("/clientOrders/:clientId", getFromClient);
router.get("/brandSales/:brandId", getFromBrand);
router.get("/get-payment-intent", getPaymentIntent);
router.post("/newOrder", postNewPurchase);
router.post("/create-payment-intent", newPaymentIntent);
router.put("/deliveredProduct", deliveredTrue);

module.exports = router;
