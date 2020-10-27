const express = require('express');
const _ = require('underscore');
let {
  verificaToken,
  verificaAdmin_Role,
} = require('./../middlewares/autenticacion');
let Categoria = require('./../models/categoria');
let app = express();

//OBTIENE TODAS LAS CATEGORIAS
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec((err, categorias) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    Categoria.count({}, (err, conteo) => {
      res.json({
        ok: true,
        categoria: categorias,
        total: conteo,
      });
    });
  });
});

//OBTIENE TODAS LAS CATEGORIAS
app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoria) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err: {
          message:'El id de esa categoria no existe'
        },
      });
    }

    res.json({
      ok: true,
      categoria,
    });
  });
});

//REGISTRA UNA NUEVA CATEGORIA
app.post("/categoria", verificaToken, (req, res) => {
  let categoria = new Categoria({
    descripcion: req.body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

//ACTUALIZA UNA CATEGORIA
app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  descCategoria= {
    descripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

//ELIMINA FISICAMENTE UNA CATEGORIA
app.delete("/categoria/:id",[verificaToken, verificaAdmin_Role],(req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id,(err, categoriaBorrada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: {
            message:'El id no existe'
          },
        });
      }

      res.json({
        ok: true,
        categoria: categoriaBorrada,
        message: 'Categoria borrada'
      });
    });
  }
);

module.exports = app;
