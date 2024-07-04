const express = require("express");
const router = express.Router();
const productsSchema = require("../models/products");
// const createJWT = require("../middlewares/authorization");

router.get("/", async (req, res) => {
  try {
    const AllProducts = await productsSchema.find();
    res.send({
      msg: "Todos los productos de la coleccion Products",
      data: AllProducts,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los productos", error: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const productFromId = await productsSchema.findOne({ _id: id });
  if (!productFromId) {
    return res.status(404).send({ msg: "Product not found" });
  } else {
    return res
      .status(201)
      .send({ msg: "Producto encontrado", data: productFromId });
  }
});

module.exports = router;
