const jwt = require("jsonwebtoken");

let verificaToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decode.usuario;
    next();
  });
};

//verifica admin_role
let verificaAdmin_Role = (req, res, next) =>{
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
    next(); 
    }else{
        return res.status(401).json({
            ok: false,
            err:{
                message: 'Debe de ser admin'
            }
        })
    }
   
}

module.exports = {
  verificaToken,
  verificaAdmin_Role
};
