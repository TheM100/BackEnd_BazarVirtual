const mongooselib = require("mongoose");

const salesSchema = new mongooselib.Schema({
  purchaseId: {
    type: mongooselib.Schema.Types.ObjectId,
    ref: "PaymentIntent",
    required: true,
    unique: true,
  },
  purchaseDate: { type: Date, default: Date.now },
  items: [
    {
      productId: {
        type: mongooselib.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      status: {
        type: String,
        enum: [
          "ActiveOrders",
          "PaymentPending",
          "CompletedOrders",
          "AllOrders",
        ],
        default: "ActiveOrders",
      },
    },
  ],
});

module.exports = salesSchema;
