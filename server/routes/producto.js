const express = require("express");
const _ = require("underscore");
const { verificaToken } = require("./../middlewares/autenticacion");
const Producto = require("./../models/producto");

const app = express();

app.get("/productos",verificaToken, (req, res) => {
  let limite = req.query.limite || 5;
  limite = Number(limite);
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({disponible: true})
    .populate("categoria", 'descripcion')
    .populate("usuario", "nombre email")
    .limit(limite)
    .skip(desde)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productos) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontraron categorias",
          },
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

app.get("/productos/:id", (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("categoria", "descripcion")
    .populate("usuario", "nombre email")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No existe el producto con ese id",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});
//BUSQUEDA DE PRODUCTOS
app.get('/productos/buscar/:termino', (req, res) =>{
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');

  Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, producto) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        producto
      })
    })

})


//INSERCION DE PRODUCTOS
app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
      message: "Producto registrado",
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "precioUni", "descripcion", 'disponible', 'categoria']);

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoUpdate) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoUpdate) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro un producto con ese id",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoUpdate,
        messaje: "Actualizado",
      });
    }
  );
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let stateDisponible = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    stateDisponible,
    { new: true },
    (err, productoUpdate) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoUpdate) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro un producto con ese id",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoUpdate,
      });
    }
  );
});

module.exports = app;