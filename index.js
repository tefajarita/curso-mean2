'use strict'
var mongoose= require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.connect('mongodb://localhost:27017/curso-mean2',(err,resp)=>{
  if (err) {
    throw err;
  } else {
    console.log("La base de datos esta conectada correctamente.....");
    app.listen(port,function(){
      console.log("Servidor de musica esta escuchando en el localhost"+port);
    })
  }
});
