const express = require("express");
const router = express.Router();
const eventsSchema = require("../models/events");
// const createJWT = require("../middlewares/authorization");

router.get("/", async (req, res) => {
  try {
    const AllEvents = await eventsSchema.find();
    res.send({
      msg: "Todos los eventos de la coleccion Events",
      data: AllEvents,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los eventos", error: error });
  }
});

module.exports = router;
