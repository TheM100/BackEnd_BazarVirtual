const validateDate = (req, res, next) => {
  //   const newDate = req.body;
  //   const currentDate = new Date();
    
  // console.log(newDate)
  // console.log(currentDate)
  
  //   if (new Date(newDate.date) < currentDate) {
  //     return res.status(400).json({ msg: "No se puede crear una fecha en el pasado" });
  //   }

  const inputDate = new Date(req.body.date);

  // Obtener la fecha actual y ajustarla a medianoche (hora local)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Ajustar la fecha proporcionada para la zona horaria local
  const localDate = new Date(inputDate.toLocaleDateString());
  
  // Comprobar si la fecha proporcionada está en el pasado
  if (localDate < currentDate) {
    return res.status(400).json({ msg: "No se puede crear una fecha en el pasado" });
  }
  
    next(); 
  };

  module.exports = validateDate;
  