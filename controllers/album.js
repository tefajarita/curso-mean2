'use strict'
var path = require('path');
var fs = require('fs');
//modulo de paginacion de mongoose
var mongoosePagination = require('mongoose-pagination');
var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require ('../models/song');


function getAlbum(req , res){
  var albumId = req.params.id;
  Artist.findById(albumId).populate({path:'artist'}).exec((err,album)=>{
      if (err) {
        res.status(200).send({
          message:'Error en la petición'
        });
      } else {
        if (!album) {
          res.status(404).send({
            message:'El album no existe'
          });
        } else {
          res.status(200).send({
              album
          });

        }
      }
  });


}

function getAlbums(req,res){
    if (req.params.page) {
      var page = req.params.page;
    } else {
      var page = 1;
    }
 q

    var itemPerPage =3;
    Artist.find().sort('name').paginate(page, itemPerPage, function(err, albums, total){
      if (err) {
        res.status(500).send({
          message:'Error en la petición'
        });
      } else {
          if (!albums) {
            res.status(404).send({
              message:'No ahì artistas'
            });
          } else {
            res.status(200).send({
              totalElementos:total,
              albums:albums
            });

          }
      }
    });
}
function saveAlbum (req,res){
   var artist = new Artist();
   var params = req.body;

   artist.name = params.name;
   artist.description = params.description;
   artist.image = 'null';

   artist.save((err,artistStored) =>{
      if (err) {
        res.status(500).send({
          message:'Error al guardar el artista'
        });
      } else {
          if (!artistStored) {
            res.status(404).send({
              message:'El artista no ha sido guardado'
            });
          }else{
            res.status(200).send({
              artist:artistStored
            });
          }
      }
   });
}

function updateAlbum(req,res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdate)=>{
        if (err) {
          res.status(500).send({
            message:'Error en la petición'
          });
        } else {
          if (!artistUpdate) {
            res.status(404).send({
              message:'No se encontro artista para actualizar'
            });
          } else {
            res.status(200).send({
              artist:artistUpdate
            });

          }

        }
    });
}

function deleteAlbum(req, res){
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId,(err,artistRemoved)=> {
      if (err) {
        res.status(500).send({
          message:'Error en la petición'
        });
      } else {
        if (!artistRemoved) {
          res.status(404).send({
            message:'No se pudo eliminar el artista'
          });
        } else {
          // res.status(200).send({
          //   artistRemoved
          // });
          Album.find({artist: artistRemoved._id}).remove((err,albumRemoved)=>{
              if (err) {
                res.status(500).send({
                  message:'Error en la petición'
                });
              } else {
                  if (!albumRemoved) {
                    res.status(404).send({
                      message:'No se pudo eliminar el album'
                    });
                  } else {
                    Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
                        if (err) {
                          res.status(500).send({
                            message:'Error en la petición'
                          });
                        } else {
                            if (!albumRemoved) {
                              res.status(404).send({
                                message:'No se pudo eliminar el canciòn'
                              });
                            } else {
                              res.status(200).send({
                                artist:artistRemoved
                              });

                    }
                  }
                });
          }
        }
      });
        }
      }
  });
}

function updateImagen(req,res){
  var artistId = req.params.id;
  var file_name= 'No se pudo subir la imagen.............';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var ext_name = ext_split[1];
    console.log(file_name);

    if (ext_name == 'png' || ext_name == 'jpg' || ext_name == 'gif') {
      var artistId= req.params.id;
      Artist.findByIdAndUpdate(artistId,{image:file_name},(err,artistUpdate)=>{
        if (err) {
          res.status(500).send({message:'error al actualizar el artista'});
        } else {
          if (!artistUpdate) {
            res.status(404).send({message:'error al no se puede actualizar el artista'});
          }else {
            res.status(200).send({artist:artistUpdate});
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
    var path_file = './uploads/artists/'+imageFile;
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
module.exports={
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  updateImagen,
  getImageFile
}
