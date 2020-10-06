'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify',false);
mongoose.Promise= global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/apirestblog', { useNewUrlParser: true })
      .then(()=>{
        console.log('La conexion a la base de datos se a realizado bien!!');
        //creamos el servidor y ponemos las peticiones https
        app.listen(port,() =>{
          console.log('servidor corriendo en http://localhost:'+port);
        });
      });
