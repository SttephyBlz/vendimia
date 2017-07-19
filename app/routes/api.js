'use strict'
var Client        = require('../models/client');
var Configuration = require('../models/configuration');
var Article       = require('../models/article');
var Sale          = require('../models/sale');

module.exports = function(router) {
  /* ========================= CONFIGURACIÓN ========================= */
  router.post('/config', function(req, res){
    //Save configuration.
    var configuration = new Configuration();

    configuration.tasa_financiamiento = req.body.tasa_financiamiento;
    configuration.porciento_enganche  = req.body.porciento_enganche;
    configuration.plazo_maximo        = req.body.plazo_maximo;

    configuration.save(function(err){
      if (err) {
          res.json({success: false, message : err});
      }else {
        res.json({ success: true, message : 'Configuración guardada.'})
      }
    });
  });

  router.get('/config', function(req, res){
    //Get configuration.
    Configuration.findOne({}, function(err, configuration) {
      if (err){
        res.json({ success: false, message : err});
      }else {
        res.json({ success: true, message : 'Configuración', config: configuration});
      }
    });
  });

  router.put('/config', function(req, res) {
    Configuration.findByIdAndUpdate(
      '596bf1accbdc5411c3c220e6',
      {$set:req.body},
      function(err, result){
            if(err){
                res.send({ success: false, message: err});
            }else{
              res.json({ success: true, message: 'Configuración actualizada.'});
            }
      }
    );
  })

  /* ========================= CLIENTES ========================= */
  router.post('/clients/new', function(req, res){
    //Save client with new ID (auto incremented).
    Client.nextCount(function(err, count) {
      var client = new Client({
        clientId: count,
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        rfc: req.body.rfc
      });

      client.save(function(err){
        if (err) {
            res.json({ success: false, message : err});
        }else {
          res.json({ success: true, message : 'Cliente registrado'});
        }
      });
    });
  });

  router.get('/clients/all', function(req,res) {
    //Get next ID
    Client.nextCount(function(err, count) {
      //Get all clients
      Client.find({}).exec(function(err, clients) {
        if (err){
          res.json({ success: false, message : err});
        }else {
          res.json({ success: true, message : 'Clientes', nextid: count, clients: clients});
        }
      });
    });
  });

  /* ========================= ARTICULOS ========================= */
  router.post('/articles/new', function(req, res, next){
    //Save article with new ID (auto incremented).
    Article.nextCount(function(err, count) {

      var article = new Article({
        articleId: count,
        descripcion: req.body.descripcion,
        modelo: req.body.modelo,
        precio: req.body.precio,
        existencia: req.body.existencia
      });

      article.save(function(err){
        if (err) {
            res.json({success: false, message : err});
        }else{
          res.json({ success: true, message : 'Artículo registrado'})
        }
      });
    });
  });

  router.get('/articles/all', function(req,res) {
    //Get next ID
    Article.nextCount(function(err, count) {
      //Get all clients
      Article.find({}, function(err, articles) {
        if (err){
          res.send({ success: false, message: err});
        }else {
          res.json({ success: true, message: 'Articulos', nextid: count, articles: articles});
        }
      });
    });
  });

  router.post('/articles/e', function(req, res) {
    Article.findOneAndUpdate(
      {articleId: req.body.id},
      {$set: {existencia: req.body.existencia}},
      function(err, result){
            if(err){
                res.send({ success: false, message: err});
            }else{
              res.json({ success: true, message: 'Articulo actualizado.'});
            }
      }
    );
  })

  router.post('/sale/new', function(req, res){
    //Save sale with new ID (auto incremented).
    Sale.nextCount(function(err, count) {
      var sale = new Sale({
        saleId: count,
        client_id: req.body.client_id,
        total: req.body.total,
        abono: req.body.abono,
        plazo: req.body.plazo,
        fecha: req.body.fecha
      });

      sale.save(function(err){
        if (err) {
            res.json({succes: false, message : err});
        }else {
          res.json({ success: true, message : 'Bien Hecho, Tu venta ha sido registrada correctament'});
        }
      });
    });
  });

  router.get('/sales/all', function(req,res) {
    //Get all sales
    Sale.find({}, function(err, sales) {
      if (err){
        res.json({ success: false, message: err});
      }else {
        res.json({ success: true, message:  'Ventas', nextid: count, sales: sales});
      }
    });
  });

  router.get('/sales/next', function(req,res) {
    //Get next ID
    Sale.nextCount(function(err, count) {

      res.json({ success: true, message: 'Ventas', nextid: count});

    });
  });

  //Return
  return router;
};
