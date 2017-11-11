'use strict'
var bCrypt = require('bcrypt-nodejs');
var User =require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req,res){
  res.status(200).send({
    message:'Probando la acción del controlador de usuarios del API rest con node'
  });
}

function saveUser(req,res){
    var user = new User();
    var params =req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.username;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image ='null';

    if (params.password) {
      //encriptar contraseña
      bCrypt.hash(params.password,null,null,function(err,hash){
        user.password = hash;
            if (params.name != "" && params.surname != "" && params.email != "" ) {
              //guardar los datos del usuario
              user.save((err,userStored)=>{
                if (err) {
                    //error  vienen problemas
                    res.status(500).send({
                      message:'Error al guardar el usuario'
                    });
                } else {
                  if (!userStored) {
                    res.status(404).send({
                      message:'El usuario no se encuentra registrado'
                    });
                  }else {
                    res.status(404).send({
                      user:userStored
                    });
                  }

                }
              });
            } else {
              res.status(200).send({
                message:'Introduce todos los campos solicitados en el formulario'
              });
            }

      });

    }else{
      res.status(200).send({
        message:'Introduce la contraseña'
      });

    }

}

function loginUser(req,res){
  var params = req.body;

  var email =params.email;
  var password = params.password;

  User.findOne({email:email.toLowerCase()},(err,user)=>{
    if (err) {
      res.status(500).send({
        message:'Error en la petición'
      });
    } else {
      if (!user) {
        res.status(404).send({
          message:'El usuario no existe'
        });
      } else {
        bCrypt.compare(password, user.password,function(err,check){
          if (check) {
            //devolver datos del usuario logueado
            if (params.gethash) {
                //devolver el token jwt
                res.status(200).send({
                  token:jwt.createToken(user)
                });
            }else{
              res.status(200).send({
              user
              });
            }

          } else {
            // devolver mensaje de Error
            res.status(500).send({
              message:'Usuario no ha podido loguearse'
            });
          }
        });

      }

    }
  });


}

function updateUser(req, res){
    var userId= req.params.id;
    var update =req.body;
    User.findByIdAndUpdate(userId,update,(err,userUpdate)=>{
        if (err) {
          res.status(500).send({message:'error al actualizar el usuario'});
        } else {
          if (!userUpdate) {
            res.status(404).send({message:'error al no se puede actualizar el usuario'});
          }else {
            res.status(200).send({user:userUpdate});
          }

        }
    });

}

function updateImagen(req,res){
  var userId = req.params.id;
  var file_name= 'No se pudo subir la imagen.............';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var ext_name = ext_split[1];
    console.log(file_name);

    if (ext_name == 'png' || ext_name == 'jpg' || ext_name == 'gif') {
      var userId= req.params.id;
      User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdate)=>{
        if (err) {
          res.status(500).send({message:'error al actualizar el usuario'});
        } else {
          if (!userUpdate) {
            res.status(404).send({message:'error al no se puede actualizar el usuario'});
          }else {
            res.status(200).send({user:userUpdate});
          }

        }
      });
    } else {
      res.status(200).send({
        message:'Formato de imagen no es permitido'
      });
    }
  } else {
    res.status(200).send({
      message:'No se ha subido la imagen.................'
    });
  }
}

function getImageFile(req, res){
    var imageFile =req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    console.log(path_file);
    fs.exists(path_file,function(exists){
      console.log(exists);
        if (exists) {
          res.sendFile(path.resolve(path_file));
        } else {
          res.status(200).send({
            message:'No se ha encontrado la imagen'
          });

        }
    });

}
module.exports =({
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  updateImagen,
  getImageFile
});
