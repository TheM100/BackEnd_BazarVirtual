const mongooselib = require("mongoose");

const purchaseHistorySchema = new mongooselib.Schema({
  purchaseId: {
    type: String,
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
      pendingDelivery: { type: Boolean, default: true },
    },
  ],
});

module.exports = purchaseHistorySchema;
