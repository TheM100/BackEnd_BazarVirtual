const mongooselib = require("mongoose");

const userEsquema = new mongooselib.Schema({
  // profilePicture: {
  //   type: String,
  //   default: '',
  // },
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
});

// const userSchema = mongooselib.model("Users", userEsquema, "users"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

const marcaEsquema = new mongooselib.Schema({
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
    required: true,
  },
  description: {
    type: String,
    // required: true, //sepuede forzar a que diga: "Escribe tu slogan aquí"
  },
  slogan: {
    type: String,
    // required: true, //sepuede forzar a que diga: "Escribe una descripción de tu marca aquí"
  },
});

// const marcaSchema = mongooselib.model("Users", marcaEsquema, "users"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD
const bazarEsquema = new mongooselib.Schema({
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
    // required: true //se puede forzar a tener algo generico y editar en perfil
  },
});

const userSchema = mongooselib.model(
  "Users",
  { userEsquema, marcaEsquema, bazarEsquema },
  "users"
); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = userSchema;
