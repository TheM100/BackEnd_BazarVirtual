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

  const productFromId = await productsSchema
    .findOne({ _id: id })
    .populate({
      //uso de populate para poblar el campo createdBy con id del bazar creador y profile picture
      path: "createdBy",
      select: "profilePicture", // Selecciona solo la imagen de perfil del usuario
      select: "username",
    })
    .exec();
  console.log(productFromId);
  if (!productFromId) {
    return res.status(404).send({ msg: "Product not found" });
  } else {
    return res
      .status(201)
      .send({ msg: "Producto encontrado", data: productFromId });
  }
});

router.get("/brand/:brandId", async (req, res) => {
  const { brandId } = req.params;
  const productsFromBrandId = await productsSchema.find({ createdBy: brandId });
  if (!productsFromBrandId || productsFromBrandId.length === 0) {
    return res.status(404).send({ msg: "No hay productos de esta marca" });
  } else {
    return res
      .status(200)
      .send({ msg: "Productos encontrados", data: productsFromBrandId });
  }
});

module.exports = router;
