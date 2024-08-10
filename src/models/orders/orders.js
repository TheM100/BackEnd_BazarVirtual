const { Schema, model } = require("mongoose");

const ordersSchema = new Schema({
  clientId: {
    type: String,
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
    },
  ],
});

const ordersModel = model("Orders", ordersSchema, "orders");
module.exports = ordersModel;
