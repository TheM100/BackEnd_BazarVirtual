const bcrypt = require("bcrypt");
const userModel = require("../models/clients/users");
const usersBazarModel = require("../models/bazar/bazarUsers");
const userMarcaModel = require("../models/marca/usersMarca");
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const AWS = require('aws-sdk');
const createJWT = require("../middlewares/authentication");

//subir imagen:
const fs = require('fs');
const path = require('path');


//configuration AWS S3
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_ACCES_KEY_AWS,
  region: process.env.REGION_AWS
});

const s3 = new AWS.S3();

//-------------------

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

const updateProfileUser = async (req, res) =>{
  const id = req.params.id
   const { password, profilePicture } = req.body;

   try {
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (profilePicture) {
      // Detectar el tipo MIME y la extensión de la imagen
      const match = profilePicture.match(/^data:(image\/(jpeg|png|gif|bmp|tiff));base64,/);
      if (!match) {
        // console.log("extencion no soportada")
       return res.status(400).send({ msg: 'Tipo de imagen no soportada.' });
      }

      const mimeType = match[1];
      const extname = mime.extension(mimeType) || 'jpeg'; 

      // Extraer el base64 de la cadena
      const base64Data = profilePicture.replace(/^data:image\/(jpeg|png|gif|bmp|tiff);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Generar el nombre del archivo con un UUID y la extensión detectada
      const fileName = `${uuidv4()}_${Date.now()}.${extname}`;

      // Definir parámetros de S3
      const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `profilePicturesUsers/${fileName}`,
        Body: buffer,
        ContentType: mimeType, // Usa el tipo MIME detectado
      };

      // Subir archivo a S3
      const data = await s3.upload(s3Params).promise();
      user.profilePicture = data.Location; 
    }

    if(password){
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        user.password = encryptedPassword;
    }

    

    await user.save();
    res.status(200).send({ msg: 'Perfil actualizado satisfactoriamente.' });

  } catch (error) {
    console.error(error);
    res.status(400).send("Error al actualizar el perfil del usuario");
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
  updateProfileUser
  
};
