const mongooselib = require("mongoose");
const socialNetworkLink = require("../bazar/schemaAux/socialNetworks");
const salesHistorySchema = require("./schemaAux/salesHistory");

const userMarcaSchema = new mongooselib.Schema({
  profilePicture: {
    type: String,
    default: "",
  },
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
  description: {
    type: String,
    default: "",
  },
  slogan: {
    type: String,
    default: "",
  },
  socialNetworks: {
    type: [socialNetworkLink],
  },
  salesHistory: { type: [salesHistorySchema] },
});

const userMarcaModel = mongooselib.model(
  "UsersMarca",
  userMarcaSchema,
  "usersMarca"
); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = userMarcaModel;
