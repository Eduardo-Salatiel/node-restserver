require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

//CONFIGURACION GLOBAL DE RUTAS
app.use(require('./routes/index'))
//CONEXION
mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;

    console.log("base de datos ONLINE");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto", 3000);
});
