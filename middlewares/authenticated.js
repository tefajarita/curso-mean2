'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret ='clave_secreta_curso';


exports.ensureAuth = function(req,res,next){
      if (!req.headers.authorization) {
        return res. status(403).send({message:'La petición no tiene cabecera de autorización'});
      }
          var token = req.headers.authorization.replace(/['"]+/g,'');
          try {
            var payload = jwt.decode(token, secret);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({message:'Token ha expirado'});
            }else {
              req.user=payload;
              next();
            }
          } catch (e) {

              res.status(404).send({token:'Token no valido'});
          }



    

};
