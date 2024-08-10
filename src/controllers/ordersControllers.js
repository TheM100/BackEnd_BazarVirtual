const mongoose = require("mongoose");

const ordersModel = require("../models/orders/orders");

const postNewPurchase = async (req, res) => {
  try {
    const { purchaseId, purchaseDate, products, clientId } = req.body;

    const newPurchase = await ordersModel.create({
      purchaseId,
      purchaseDate,
      products,
      clientId,
    });

    res.status(201).json({ success: true, data: newPurchase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getFromClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const clientPurchases = await ordersModel
      .find({ clientId: clientId })
      .populate({
        path: "products.productId",
        model: "Products", // Popula el productId con el modelo Products
      })
      .populate({
        path: "products.brandId",
        model: "UsersMarca", // Popula el brandId con el modelo UsersMarca
        select: "username profilePicture", // Selecciona solo los campos username y profilePicture
      });

    // Extraer, aplanar los productos y agregar el purchaseId a cada producto
    const products = clientPurchases.flatMap((purchase) =>
      purchase.products.map((product) => ({
        ...product.toObject(), // Convertimos el subdocumento a un objeto regular
        productId: product.productId, // Aquí el productId ya debe estar populado
        brandId: product.brandId, // Aquí el brandId ya debe estar populado
        purchaseId: purchase.purchaseId, // Agregamos el purchaseId correspondiente
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

    // Convertir brandId a ObjectId si es necesario
    const brandObjectId = mongoose.Types.ObjectId.isValid(brandId)
      ? new mongoose.Types.ObjectId(brandId)
      : brandId;

    // Buscar todas las compras que incluyan productos de la marca específica y hacer la población
    const brandPurchases = await ordersModel
      .find({ "products.brandId": brandObjectId })
      .populate({
        path: "products.productId",
        model: "Products",
      })
      .populate({
        path: "products.brandId",
        model: "UsersMarca",
        select: "username profilePicture",
      });

    // Extraer, filtrar y aplanar productos cuyo brandId coincide
    const products = brandPurchases.flatMap((purchase) =>
      purchase.products
        .filter(
          (product) =>
            product.brandId._id.toString() === brandObjectId.toString() // Comparar ID como string
        )
        .map((product) => ({
          ...product.toObject(),
          productId: product.productId,
          brandId: product.brandId,
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
