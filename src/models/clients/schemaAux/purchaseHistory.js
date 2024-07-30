const mongooselib = require("mongoose");

const purchaseHistorySchema = new mongooselib.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  productId: {
    type: mongooselib.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = purchaseHistorySchema;
