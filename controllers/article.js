'use strict'
var validator = require('validator');
var fs = require('fs');
var path =require('path');
var Article = require('../models/article');
var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;
    console.log('Hola Mundo');
    return res.status(200).send({
      curso: 'Master en framework js',
      autor: 'victorrobles',
      url:'http://pagina.com/nose/',
      hola
    });
  },
  test:(req, res) => {
    return res.status(200).send({
      message: 'Soy la accion test de mi controlador de articulos'
    });
  },
  save: (req, res) => {
    //Recoger parametros por post
    var params = req.body; // averiguar como se envia este opgeto
    console.log(params);
    // Validar datos (Validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      

    } catch (err) {
      return res.status(200).send({
        status: 'error',
        menssage: 'faltan datos por enviar!'
      });
    } finally {

    }

    if (validate_title && validate_content) {
      //Crear el objeto a guardar
      var article = new Article();
      //Asignar valores
      article.title = params.title;
      article.content = params.content;
      if(params.image){
        article.image=params.image;
      }else{
        article.image = null;
      }
      
      //Guardar articulos
      article.save((err, articleStored)=>{
        if(err || !articleStored){
          return res.status(404).send({
            status: 'error',
            menssage: 'el articulo no se a guardado'
          });
        }else {
          //Devolver una respuesta.
          return res.status(200).send({
            status: 'success',
            article: articleStored
          });
        }
      });

    } else {
      return res.status(200).send({
        status: 'error',
        menssage: 'los datos no son validos'
      });
    }

  },
  getArticles: (req, res) => {

    var querty = Article.find({});

    var last = req.params.last;
    if (last || last != undefined){
      querty.limit(5);
    }
    console.log(last);
    //find
    // con sort puedo ordenar la lista resultante de la busqueda
    querty.sort('-_id').exec((err, articles) =>{
      if (err) {
        return res.status(500).send({
          status: 'error',
          menssage: 'Error al devolver los articulos'
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: 'error',
          menssage: 'Error, no hay articulos para mostrar'
        });
      }
      return res.status(200).send({
        status: 'success',
        articles
      });
    });

  },
  getArticle: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;
    //comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: 'error',
        menssage: 'No existe el articulo'
      });
    }
    //buscarel articulo
    Article.findById(articleId, (err, article) => {
      if (err) {
        return res.status(500).send({
          status: 'error',
          menssage: 'Error al devolver los datoss'
        });
      }
      if (!article) {
        return res.status(404).send({
          status: 'error',
          menssage: 'no existe el articulo'
        });
      }
      //devolver
      return res.status(200).send({
        status: 'success',
        article
      });
    });
  },
  update: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;
    // Los datos que llegan por put
    var params = req.body;

    //validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);

    } catch (err) {
      return res.status(404).send({
        status: 'error',
        menssage: 'Faltan datos por enviar!!'
      });
    }

    if(validate_title && validate_content){
      //Find update
      Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUdated) => {
        if (err){
          return res.status(500).send({
            status: 'error',
            menssage: 'Error al actualizar!!'
          });
        }
        if (!articleUdated){
          return res.status(404).send({
            status: 'error',
            menssage: 'No existe el articulo!!'
          });
        }
        return res.status(200).send({
          status: 'success',
          article: articleUdated
        });
      });
    }else {
      return res.status(200).send({
        status: 'error',
        menssage: 'La validacion no es correcta!!'
      });
    }
    return res.status(404).send({
      status: 'error',
      menssage: 'No existe el articulo'
    });
  },
  delete: (req, res) => {
    // Recoger el id de la url
    var articleId = req.params.id;
    // Find and delete

    Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) =>{
      if(err){
        return res.status(500).send({
          status: 'error',
          menssage: 'Error al borrar!!'
        });
      }
      if(!articleRemoved){
        return res.status(404).send({
          status: 'error',
          menssage: 'No se a borrado el articulo, posiblemente no exista!!'
        });
      }
      return res.status(200).send({
        status: 'success',
        menssage: 'el articulo fue eliminado',
        article: articleRemoved
      });
    });

  },//borrar
  upload: (req, res) =>{
    // configurar el modulo connect multiparty router/article.js(ya esta hecho)
    // Recoger el fichero de la peticion()
    var file_name = 'Imagen no subida...';
    if(!req.files){
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }
    // Conseguir nombre y extencion del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split('\\');
  //  /*** *ADVERTENCIA* EN UNIX(LINUZ O MAC) ***/
  // var file_split = file_path.split('/'); UNA SOLA BARRA EN VES DE DOS.

  //nombre del archivo
    var file_name = file_split[2];
    //Extencion el fichero
    var extension_split= file_name.split('\.');
    var file_ext = extension_split[1];

    // Comprobar la extencion del archivo, solo imagenes o borrar el fichero
    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
      // borrar el archivo
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: 'error',
          message: 'la extencion del archivo no es valida'
        });
      });
    }else {
      // si es valido, sacando ide de la url
      var articleId = req.params.id;

      if(articleId){

        //  Bucar el articulo, asignarle el nombre de la imagen y actualizarlo
        Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUdated) =>{
  
          if (err || !articleUdated){
            return res.status(200).send({
              status: 'error',
              message: 'Error al guardar la image de articulo'
            });
          }
          return res.status(200).send({
            status: 'success',
            article: articleUdated
          });
        });

      }else{
        return res.status(200).send({
          status: 'success',
          image: file_name
        });
      }

    }
  },//end upload file
  getImage: (req, res) => {
    var file = req.params.image;
    var path_file = './upload/articles/'+file;

    fs.exists(path_file, (exists) =>{
      console.log(exists);
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      }else {
        return res.status(404).send({
          status: 'error',
          message: 'la imagen no existe'
        });
      }
    });
  },//end getImage
  search: (req, res) => {
    var searchString = req.params.search;
    //find
    Article.find({ "$or":[
      {"title": {"$regex": searchString, "$options": "i"}},
      {"content": {"$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec((err, articles) =>{

      if(err){
        return res.status(500).send({
          status: 'error',
          message: 'existe un error en la peticion!!',
        });
      }

      if(!articles || articles.length <= 0){
        return res.status(404).send({
          status: 'error',
          message: 'No existe un articulo que coincida con tu buquea',
        });
      }

      return res.status(200).send({
        status: 'success',
        articles
      });
    });
  }
};// este es el final de mi controller{end controler}

module.exports = controller;
