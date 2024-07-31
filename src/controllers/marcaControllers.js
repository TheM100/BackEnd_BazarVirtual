const bcrypt = require("bcrypt");
const userMarcaModel = require("../models/marca/usersMarca");

const getUSersMarca = async (req, res) => {
  try {
    const AllUsersMarca = await userMarcaModel.find();
    res.send({
      msg: "Todos las marcas registradas",
      data: AllUsersMarca,
    });
  } catch (error) {
    res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
  }
};

const getMarcaById = async (req, res) => {
  try {
    const idMarca = req.params.id;
    const marcaFromId = await userMarcaModel.findOne({ _id: idMarca });
    res.send({
      msg: "Única marca de la colección marcas",
      data: marcaFromId,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo encontrar a la marca", error: error });
  }
};

const registerMarca = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    socialNetworks,
    description,
    slogan,
    profilePicture,
    salesHistory,
  } = req.body;

  try {
    const existingMail = await userMarcaModel.findOne({ email: email });
    const existingMarcaName = await userMarcaModel.findOne({
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

    const user = new userMarcaModel({
      username,
      email,
      profilePicture,
      password: encryptedPassword,
      role,
      description,
      salesHistory: salesHistory || [],
      slogan,
      socialNetworks: parsedSocialNetworks,
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(400).send({ msg: "Usuario no guardado", error: error });
  }
};

const updateProfileMarca = async (req, res) => {
  const _id = req.params.id;
  const { socialNetworks, slogan, description, username } = req.body; //agregar el perfilPicture
  try {
    const user = await userMarcaModel.findById(_id);

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
};

module.exports = {
  getUSersMarca,
  getMarcaById,
  registerMarca,
  updateProfileMarca,
};
