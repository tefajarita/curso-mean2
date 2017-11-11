'use strict'

var express = require('express');

var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var api =express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});
//indico el nombre de la ruta
api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.updateImagen);
api.get('/get-imagen-user/:imageFile',UserController.getImageFile);
module.exports= api;
