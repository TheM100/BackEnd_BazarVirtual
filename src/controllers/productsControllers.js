const productsModel = require("../models/marca/products");

const getProducts = async (req, res) => {
  try {
    const AllProducts = await productsModel.find();
    res.send({
      msg: "Todos los productos de la coleccion Products",
      data: AllProducts,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los productos", error: error });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  const productFromId = await productsModel
    .findOne({ _id: id })
    .populate({
      //uso de populate para poblar el campo createdBy con id del bazar creador y profile picture
      path: "createdBy",
      select: "profilePicture username", // Selecciona solo la imagen de perfil del usuario
    })
    .exec();
  if (!productFromId) {
    return res.status(404).send({ msg: "Product not found" });
  } else {
    return res
      .status(201)
      .send({ msg: "Producto encontrado", data: productFromId });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productImage, title, price, description, category } = req.body;
  try {
    const productFromId = await productsModel.findById(id);
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
};

const getProductsOfMarca = async (req, res) => {
  const { brandId } = req.params;
  const productsFromBrandId = await productsModel.find({ createdBy: brandId });
  if (!productsFromBrandId || productsFromBrandId.length === 0) {
    return res.status(404).send({ msg: "No hay productos de esta marca" });
  } else {
    return res
      .status(200)
      .send({ msg: "Productos encontrados", data: productsFromBrandId });
  }
};

const createNewProduct = async (req, res) => {
  try {
    const newProduct = req.body;

    if (isNaN(newProduct.price) || newProduct.price < 10) {
      return res
        .status(400)
        .send({ msg: "El precio debe ser al menos 10 pesos." });
    }

    const product = await productsModel.create(newProduct);

    res.status(201).send({ msg: "Nuevo Producto creado con éxito!" });
  } catch (error) {
    console.log("error ", error);
    res
      .status(400)
      .send({ msg: "No fue posible crear el producto", error: error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productsModel.findByIdAndDelete(id);

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
};

module.exports = {
  getProducts,
  getProductById,
  updateProduct,
  getProductsOfMarca,
  createNewProduct,
  deleteProduct,
};
