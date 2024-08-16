const { Schema, model } = require("mongoose");

const ordersSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  purchaseId: {
    type: String,
    required: true,
    unique: true,
  },
  purchaseDate: { type: Date, default: Date.now },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      brandId: {
        type: Schema.Types.ObjectId,
        ref: "UsersMarca",
        required: true,
      },
      quantity: { type: Number, required: true },
      pendingDelivery: { type: Boolean, default: true },
      productTitle: { type: String, required: true }, // Almacenar el título del producto
      productImage: { type: String, required: true }, // Almacenar la imagen del producto
      brandUsername: { type: String, required: true }, // Almacenar el nombre de usuario de la marca
      brandProfilePicture: { type: String, required: true }, // Almacenar la imagen de perfil de la marca
    },
  ],
});

const ordersModel = model("Orders", ordersSchema, "orders");
module.exports = ordersModel;
