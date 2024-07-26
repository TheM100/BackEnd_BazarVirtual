const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userMarcaSchema = require("../models/marca/usersMarca");
const createJWT = require("../middlewares/authentication");

router.get("/usersMarca", async (req, res) => {
  try {
    const AllUsersMarca = await userMarcaSchema.find();
    res.send({
      msg: "Todos las marcas registradas",
      data: AllUsersMarca,
    });
  } catch (error) {
    res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const idMarca = req.params.id;
    const marcaFromId = await userMarcaSchema.findOne({ _id: idMarca });
    res.send({
      msg: "Única marca de la colección marcas",
      data: marcaFromId,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo encontrar a la marca", error: error });
  }
});

router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    socialNetworks,
    description,
    slogan,
    profilePicture,
  } = req.body;

  try {
    const existingMail = await userMarcaSchema.findOne({ email: email });
    const existingMarcaName = await userMarcaSchema.findOne({
      username: username,
    });
    if (existingMail) {
      return res
        .status(400)
        .send({ msg: "El correo electrónico ya está registrado." });
    }
    if (existingMarcaName) {
      return res
        .status(400)
        .send({ msg: "Nombre de usuario registrado, prueba con otro." });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    let parsedSocialNetworks = [];
    if (Array.isArray(socialNetworks)) {
      parsedSocialNetworks = socialNetworks.map((network) => ({
        platform: network.platform,
        url: network.url,
      }));
    }

    const user = new userMarcaSchema({
      username,
      email,
      profilePicture,
      password: encryptedPassword,
      role,
      description,
      slogan,
      socialNetworks: parsedSocialNetworks,
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(400).send({ msg: "Usuario no guardado", error: error });
  }
});

router.put("/updateProfile/:id", async (req, res) => {
  const _id = req.params.id;
  const { socialNetworks, slogan, description, username } = req.body; //agregar el perfilPicture
  try {
    const user = await userMarcaSchema.findById(_id);

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (username) user.username = username;
    user.slogan = slogan;
    user.description = description;
    user.socialNetworks = socialNetworks;

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).send("Error al actualizar el usuario");
  }
});

module.exports = router;
