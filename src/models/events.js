const mongooselib = require("mongoose");

const eventsEsquema = new mongooselib.Schema({
  username: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
});

const eventsSchema = mongooselib.model("Events", eventsEsquema, "events"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = eventsSchema;
