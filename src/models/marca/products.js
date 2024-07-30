const mongooselib = require("mongoose");

const productsSchema = new mongooselib.Schema({
  createdBy: {
    type: String,
    type: mongooselib.Schema.Types.ObjectId,
    ref: "UsersMarca",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const productsModel = mongooselib.model(
  "Products",
  productsSchema,
  "products"
); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = productsModel;