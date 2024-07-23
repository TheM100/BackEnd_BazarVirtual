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
  if (!productFromId) {
    return res.status(404).send({ msg: "Product not found" });
  } else {
    return res
      .status(201)
      .send({ msg: "Producto encontrado", data: productFromId });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { productImage, title, price, description, category } = req.body;
  try {
    const productFromId = await productsSchema.findById(id);
    if (!productFromId) {
      return res.status(404).send({ msg: "Product not found" });
    }
    if (title) productFromId.title = title;
    productFromId.productImage = productImage;
    productFromId.price = price;
    productFromId.description = description;
    productFromId.category = category;
    await productFromId.save();
    res.send(productFromId);
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
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

router.post("/newProduct", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productsSchema.create(newProduct);

    res.status(201).send({ msg: "Nuevo Producto creado con exito!" });
  } catch (error) {
    console.log("error ", error);
    res
      .status(400)
      .send({ msg: "No fue posible crear el producto", error: error });
  }
});
module.exports = router;

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productsSchema.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send({ msg: "Producto no encontrado" });
    }

    res
      .status(200)
      .send({ msg: "Producto eliminado con éxito", data: product });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res.status(500).send({ msg: "Error al eliminar el producto" });
  }
});
