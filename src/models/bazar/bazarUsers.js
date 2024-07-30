const mongooselib = require("mongoose");
const socialNetworksSchema = require("./schemaAux/socialNetworks")


const BazarUsersSchema = new mongooselib.Schema({

  username: {
    type: String,
    required: true,
    
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
  webPage: {
    type: String, 
   
  },
  socialNetworks: {
    type: [socialNetworksSchema]
     
  },
  profilePicture: {
    type: String,
    default: '',
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

const usersBazarModel = mongooselib.model("usersBazar", BazarUsersSchema, "usersBazares"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = usersBazarModel;
