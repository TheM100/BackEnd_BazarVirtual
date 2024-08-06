const bcrypt = require("bcrypt");
const userModel = require("../models/clients/users");
const usersBazarModel = require("../models/bazar/bazarUsers");
const userMarcaModel = require("../models/marca/usersMarca");
const createJWT = require("../middlewares/authentication");
const mongooselib = require("mongoose");

const getUsers = async (req, res) => {
  try {
    const AllUsers = await userModel.find();
    res.send({
      msg: "Todos los usuarios de la coleccion Users",
      data: AllUsers,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los usuarios", error: error });
  }
};

const userById = async (req, res) => {
  const id = req.params.id;
  try {
    const userById = await userModel.findOne({ _id: id });
    res.send({
      msg: "Único usuario con id de la coleccion Users",
      data: userById,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los usuarios", error: error });
  }
};

const getWishListUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({ wishList: user.wishList });
  } catch (error) {
    console.error("Error al obtener la wish list:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

const getShoppingCartUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({ shoppingCart: user.shoppingCart });
  } catch (error) {
    console.error("Error al obtener el shopping cart:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

const registerUser = async (req, res) => {
  const {
    username,
    email,
    role,
    password,
    shoppingCart,
    wishList,
    purchaseHistory,
  } = req.body;
  try {
    const existingMail = await userModel.findOne({ email: email });
    const existingUsername = await userModel.findOne({ username: username });
    if (existingMail) {
      return res
        .status(400)
        .send({ msg: "El correo electrónico ya está registrado." });
    }
    if (existingUsername) {
      return res
        .status(400)
        .send({ msg: "Nombre de usuario registrado, prueba con otro." });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      username: username,
      email: email,
      password: encryptedPassword,
      profilePicture:
        "https://i.pinimg.com/564x/ae/b1/1b/aeb11beacadba9b52bede423eeefeea5.jpg",
      role: role || "cliente",
      shoppingCart: shoppingCart || [],
      wishList: wishList || [],
      purchaseHistory: purchaseHistory || [],
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    res.status(400).send({ msg: "Usuario no guardado", Error: error });
  }
};

const generalLogin = async (req, res) => {
  //este enPoint es usado por los 3 tipos de users
  try {
    const { email, password } = req.body;

    const schemas = [userModel, usersBazarModel, userMarcaModel];

    let user = null;

    for (let schema of schemas) {
      user = await schema.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).send({ msg: "user not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ msg: "Incorrect password" });
    } else {
      const token = createJWT({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
      return res.status(201).send({ msg: "login successfull", data: token });
    }
  } catch (error) {
    res.status(400).send({ msg: "Invalid login", Error: error });
  }
};

const updateShoppingCart = async (req, res) => {
  const userId = req.params.id;
  const { shoppingCart } = req.body;

  if (!Array.isArray(shoppingCart)) {
    return res
      .status(400)
      .send({ msg: "El formato del shoppingCart no es válido." });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { shoppingCart },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado." });
    }

    res
      .status(200)
      .send({ msg: "ShoppingCart actualizado con éxito.", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar el shoppingCart:", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};
const updateQuantityShoppingCart = async (req, res) => {
  const userId = req.params.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .send({ msg: "El formato del shoppingCart no es válido." });
  }

  if (quantity < 1) {
    return res.status(400).send({ msg: "La cantidad debe ser al menos 1." });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ msg: "Usuario no encontrado." });
    }

    const itemIndex = user.shoppingCart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex !== -1) {
      user.shoppingCart[itemIndex].quantity = quantity;
      await user.save();
      return res
        .status(200)
        .send({ msg: "ShoppingCart actualizado con éxito.", user });
    } else {
      return res
        .status(404)
        .send({ msg: "Producto no encontrado en el carrito." });
    }
  } catch (error) {
    console.error("Error al actualizar el shoppingCart:", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};

const deleteShoppingCart = async (req, res) => {
  const userId = req.params.id;
  const shoppingCart = [];
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { shoppingCart },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }
    res
      .status(200)
      .send({ msg: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error al borrar el shoppingCart", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};

const deleteProductFromShoppingCart = async (req, res) => {
  const userId = req.params.id;
  const { productId } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { shoppingCart: { productId: productId } } },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }
    res
      .status(200)
      .send({ msg: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error al borrar producto de shoppindList", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};
const deleteProductFromWishList = async (req, res) => {
  const userId = req.params.id;
  const { productId } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishList: { productId: productId } } },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }
    res
      .status(200)
      .send({ msg: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error al borrar producto de wishList", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};

const updateWishList = async (req, res) => {
  const userId = req.params.id;
  const { wishList } = req.body;

  if (!Array.isArray(wishList)) {
    return res
      .status(400)
      .send({ msg: "El formato del wishList no es válido." });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { wishList },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado." });
    }

    res
      .status(200)
      .send({ msg: "wishList actualizado con éxito.", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar el wishList:", error);
    res.status(500).send({ msg: "Error en el servidor", error });
  }
};

const addItemToPurchaseHistory = async (req, res) => {
  const id = req.params.id; // ID del usuario
  const { purchaseId, items, purchaseDate } = req.body;

  if (typeof purchaseId !== "string" || !Array.isArray(items)) {
    return res.status(400).send({ error: "Invalid data format" });
  }

  for (const item of items) {
    if (
      !mongooselib.Types.ObjectId.isValid(item.productId) ||
      typeof item.quantity !== "number"
    ) {
      return res.status(400).send({ error: "Invalid item format" });
    }
  }

  try {
    const userExists = await userModel.findById(id); // Verificar si el usuario existe
    if (!userExists) {
      return res.status(404).send({ error: "User not found" });
    }

    // Verificar si el purchaseId ya existe en el historial de compras del usuario
    const existingPurchase = userExists.purchaseHistory.find(
      (history) => history.purchaseId === purchaseId
    );

    if (existingPurchase) {
      return res.status(400).send({ error: "Purchase ID already exists" });
    }

    // Actualizar el historial de compras
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          purchaseHistory: {
            purchaseId,
            purchaseDate,
            items,
          },
        },
      },
      { new: true, runValidators: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error("Error updating purchase history:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  userById,
  registerUser,
  generalLogin,
  updateShoppingCart,
  updateWishList,
  getWishListUser,
  getShoppingCartUser,
  deleteShoppingCart,
  deleteProductFromShoppingCart,
  deleteProductFromWishList,
  updateQuantityShoppingCart,
  addItemToPurchaseHistory,
};
