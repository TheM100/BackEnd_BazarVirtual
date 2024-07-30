const express = require("express");
const router = express.Router();


const{getUsers, userById, registerUser,
      generalLogin, updateShoppingCart, updateWishList,
      getWishListUser, getShoppingCartUser
      } = require("../controllers/usersControllers")

router.get("/", getUsers );

router.get("/:id", userById );

router.get("/wishList/:id",  getWishListUser);

router.get("/shoppingCart/:id", getShoppingCartUser );

router.post("/register", registerUser );

router.post("/login", generalLogin );

router.put("/shoppingCart/:id", updateShoppingCart );

router.put("/wishList/:id", updateWishList );



// router.delete("/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // Buscar al usuario por ID
//     const userToDelete = await userModel.findOneAndDelete(userId);

//     if (!user) {
//       return res.status(404).json({ msg: "Usuario no encontrado" });
//     }

//     // Devolver el shopping cart del usuario
//     res.status(200).json({ shoppingCart: userToDelete.shoppingCart });
//   } catch (error) {
//     console.error("Error al borrar el shopping cart:", error);
//     res.status(500).json({ msg: "Error en el servidor", error });
//   }
// });

module.exports = router;
