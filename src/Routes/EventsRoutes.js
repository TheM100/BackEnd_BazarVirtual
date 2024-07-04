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

router.get("/bazar/:bazarId", async (req, res) => {
  const { bazarId } = req.params;

  const eventsFromBazarId = await eventsSchema.find({ bazarId: bazarId });

  if (!eventsFromBazarId || eventsFromBazarId.length === 0) {
    return res.status(404).send({ msg: "No hay eventos de este bazar" });
  } else {
    return res
      .status(200)
      .send({ msg: "Eventos encontrados", data: eventsFromBazarId });
  }
});

module.exports = router;
