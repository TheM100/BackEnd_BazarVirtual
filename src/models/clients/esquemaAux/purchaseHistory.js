const mongooselib = require("mongoose");

const purchaseHistoryEsquema = new mongooselib.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = purchaseHistoryEsquema;
