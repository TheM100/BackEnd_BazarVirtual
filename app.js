require("dotenv").config(); //metodo para invocar variables de desarrollo
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;

const userRoutes = require("./src/Routes/UserRoutes");
const productRoutes = require("./src/Routes/ProductsRoutes");
const ordersRoutes = require("./src/Routes/ordersRoutes");
const bazarRoutes = require("./src/Routes/bazarRoutes");
const marcaRoutes = require("./src/Routes/marcaRoutes");
const { connect } = require("./src/dataBase/ConectionDB");

//Comentario test
connect();
// app.use(cors({ origin: "http://localhost:3000" }));
const allowedOrigins = ["http://localhost:3000", "http://www.localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// app.use(express.json());
app.use(express.json({ limit: "10mb" })); // Por ejemplo, 10 megabytes

app.get("/", (req, res) => {
  res.send({ msg: "This is Home compa" });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);
app.use("/bazar", bazarRoutes);
app.use("/marca", marcaRoutes);

app.listen(PORT, () => {
  console.log("server is ready in port " + PORT);
});
