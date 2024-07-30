require("dotenv").config(); //metodo para invocar variables de desarrollo
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;

const userRoutes = require("./src/Routes/UserRoutes");
const productRoutes = require("./src/Routes/ProductsRoutes");
const bazarRoutes = require("./src/Routes/bazarRoutes");
const marcaRoutes = require("./src/Routes/marcaRoutes");
const { connect } = require("./src/dataBase/ConectionDB");

//Comentario test
connect();
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "This is Home compa" });
});

app.use("/users", userRoutes); 
app.use("/products", productRoutes); 
app.use("/bazar", bazarRoutes);
app.use("/marca", marcaRoutes);

app.listen(PORT, () => {
  console.log("server is ready in port " + PORT);
});
