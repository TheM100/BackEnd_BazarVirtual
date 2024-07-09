const validateDate = (req, res, next) => {
    const newDate = req.body;
    const currentDate = new Date();
    
  
    if (new Date(newDate.date) < currentDate) {
      return res.status(400).json({ msg: "No se puede crear una fecha en el pasado" });
    }
  
    next(); // Continuar con el siguiente middleware o controlador
  };

  module.exports = validateDate;
  