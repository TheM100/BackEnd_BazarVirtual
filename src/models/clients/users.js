const mongooselib = require("mongoose");
const wishListSchema = require("./schemaAux/wishList");
const shoppingCartSchema = require("./schemaAux/shoppingCart");
const purchaseHistorySchema = require("./schemaAux/purchaseHistory");

const userSchema = new mongooselib.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "ingresa un correo electronico valido, ejemplo juan@gmail.com",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  shoppingCart: { type: [shoppingCartSchema] },
  wishList: { type: [wishListSchema] },
  purchaseHistory: { type: [purchaseHistorySchema] },
});


const userModel = mongooselib.model("Users", userSchema, "users"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = userModel;
