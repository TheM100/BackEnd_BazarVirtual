require("dotenv").config(); //metodo para invocar variables de desarrollo
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;



const userRoutes = require("./src/Routes/UserRoutes"); //importando las routes de users
const productRoutes = require("./src/Routes/ProductsRoutes");
const eventsRoutes = require("./src/Routes/EventsRoutes");
const bazarRoutes = require('./src/Routes/bazarRoutes')
const { connect } = require("./src/dataBase/ConectionDB");


connect();
app.use(cors({ origin: "http://localhost:3000" }));


app.use(express.json());

app.get("/", (req, res) => {
  //primer endPoint que salta
  res.send({ msg: "This is Home compa" });
});

app.use("/users", userRoutes); //usamos endpoints de users
app.use("/products", productRoutes); //usamos endpoints de products
app.use("/events", eventsRoutes); //usamos endpoints de events
app.use("/bazar", bazarRoutes);

app.listen(PORT, () => {
  console.log("server is ready in port " + PORT);
});
