const mongooselib = require("mongoose");
const socialNetworkLink = require("./eschemaAux/socialNetworks")


const BazarUsersEsquema = new mongooselib.Schema({

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
  wepPage: {
    type: String, 
   
  },
  socialNetworks: {
    type: [socialNetworkLink]
     
  },
  profilePicture: {
    type: Buffer,
    required:true 
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

const usersBazarSchema = mongooselib.model("usersBazar", BazarUsersEsquema, "usersBazares"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = usersBazarSchema;
