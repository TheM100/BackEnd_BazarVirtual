const mongooselib = require("mongoose");

const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@bazarvirtual.ns1cbbc.mongodb.net/${process.env.NAME_DB}`;
//@bazarvirtual.ns1cbbc.mongodb.net/
// @firtsdb.1bgnhei.mongodb.net/
async function connect() {
  try {
    let connection = await mongooselib.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Ajuste del tiempo de espera
    });
    if (connection) {
      console.log("Conexión a la BD establecida correctamente");
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    throw new Error(error);
  }
}

function disconnect() {
  mongooselib
    .disconnect()
    .then(() => {
      console.log("Desconexión de la BD exitosa");
    })
    .catch((error) => {
      console.error("Error al desconectar de la base de datos:", error.message);
    });
}

module.exports = {
  connect,
  disconnect,
};
