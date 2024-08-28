require("dotenv").config(); //metodo para invocar variables de desarrollo

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const mongoose = require("mongoose");

const ordersModel = require("../models/orders/orders");
const productsModel = require("../models/marca/products");
const userMarcaModel = require("../models/marca/usersMarca");

const postNewPurchase = async (req, res) => {
  try {
    const { purchaseId, purchaseDate, products, clientId } = req.body;

    // Crear una nueva lista de productos con la información adicional
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const productDetails = await productsModel
          .findById(product.productId)
          .select("title productImage");
        const brandDetails = await userMarcaModel
          .findById(product.brandId)
          .select("username profilePicture");

        return {
          ...product,
          productTitle: productDetails.title,
          productImage: productDetails.productImage,
          brandUsername: brandDetails.username,
          brandProfilePicture: brandDetails.profilePicture,
        };
      })
    );

    const newPurchase = await ordersModel.create({
      purchaseId,
      purchaseDate,
      products: updatedProducts,
      clientId,
    });

    res.status(201).json({ success: true, data: newPurchase });
  } catch (error) {
    console.error("Error in postNewPurchase:", error);

    res.status(500).json({ success: false, error: error.message });
  }
};

const getFromClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const clientPurchases = await ordersModel.find({ clientId: clientId });

    const products = clientPurchases.flatMap((purchase) =>
      purchase.products.map((product) => ({
        ...product.toObject(),

        purchaseId: purchase.purchaseId,
      }))
    );

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFromBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brandObjectId = mongoose.Types.ObjectId.isValid(brandId)
      ? new mongoose.Types.ObjectId(brandId)
      : brandId;

    const brandPurchases = await ordersModel.find({
      "products.brandId": brandObjectId,
    });

    const products = brandPurchases.flatMap((purchase) =>
      purchase.products
        .filter(
          (product) =>
            product.brandId._id.toString() === brandObjectId.toString()
        )
        .map((product) => ({
          ...product.toObject(),

          purchaseId: purchase.purchaseId,
        }))
    );

    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "No products found for this brand." });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products for brand:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deliveredTrue = async (req, res) => {
  try {
    const { purchaseId, productId } = req.body;

    // Actualizar el estado de entrega del producto en la compra
    const updatedPurchase = await ordersModel.updateOne(
      { purchaseId, "products.productId": productId },
      { $set: { "products.$.pendingDelivery": false } }
    );

    res.status(200).json({ success: true, data: updatedPurchase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const newPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not defined");
    }

    const { amount, metadata, receipt_email } = req.body;

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (typeof metadata.items !== "string") {
      return res.status(400).json({ error: "Invalid items format" });
    }

    const items = JSON.parse(metadata.items);

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Parsed items are not an array" });
    }

    const purchaseDate = new Date().toISOString();

    const compactItems = items
      .map((item) => `${item._id}:${item.quantity}`)
      .join(",");

    // Crear el Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "mxn",
      automatic_payment_methods: { enabled: true },
      receipt_email: receipt_email,
      metadata: {
        items: compactItems,
        purchase_date: purchaseDate,
      },
    });

    // Devolver el client_secret en la respuesta
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Internal Error:", error.message);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

const getPaymentIntent = async (req, res) => {
  try {
    const { payment_intent } = req.query;

    if (!payment_intent) {
      throw new Error("Missing payment_intent");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    return res.json({ metadata: paymentIntent.metadata });
  } catch (error) {
    console.error("Internal Error:", error.message);
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};
module.exports = {
  postNewPurchase,
  getFromClient,
  getFromBrand,
  deliveredTrue,
  newPaymentIntent,
  getPaymentIntent,
};
