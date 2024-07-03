const mongooselib = require("mongoose");

const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@bazarvirtual.ns1cbbc.mongodb.net/${process.env.NAME_DB}`;

async function connect() {
  //esta funcion es la que realiza la conexion, siempre tiene que estar precente para cualquier backEnd que utilize mongoose
  try {
    let connection = await mongooselib.connect(URI);
    if (connection) {
      console.log("Conexion a la BD establecida correctamente");
    }
  } catch (error) {
    throw new Error(error);
    // console.log(error)
  }
}

function disconnect() {
  //esta funcion por otra parte invoca al metodo disconnect para dejar la conexion
  mongooselib.disconnect();
}

module.exports = {
  connect,
  disconnect,
};
