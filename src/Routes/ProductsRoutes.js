const express = require("express");
const router = express.Router();

const {getProducts, getProductById, updateProduct,
      getProductsOfMarca, createNewProduct, deleteProduct
      } = require("../controllers/productsControllers")


router.get("/", getProducts);

router.get("/:id", getProductById );

router.get("/brand/:brandId", getProductsOfMarca );

router.post("/newProduct", createNewProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct );


module.exports = router;
