require('dotenv').config() //metodo para invocar variables de desarrollo
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;


const userRoutes = require("./src/Routes/UserRoutes") //importando las routes de users
const {connect} = require('./utils/ConectionDB')


connect();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json())


app.get('/',  (req, res)=>{   //primer endPoint que salta
    res.send({msg:'This is Home compa'})
    })


app.use('/users',userRoutes) //usamos endpoints de users


app.listen(PORT,()=>{
    console.log("server is ready in port " + PORT)
    })