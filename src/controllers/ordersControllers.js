const mongoose = require("mongoose");

const ordersModel = require("../models/orders/orders");
const productsModel = require("../models/marca/products");
const userMarcaModel = require("../models/marca/usersMarca");

const postNewPurchase = async (req, res) => {
  try {
    const { purchaseId, purchaseDate, products, clientId } = req.body;
    console.log("Received data:", req.body);

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

module.exports = {
  postNewPurchase,
  getFromClient,
  getFromBrand,
  deliveredTrue,
};
