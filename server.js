const express     = require ('express'),
      app         = express(),
      port        = process.env.PORT || 3000,
      bodyParser  = require('body-parser'),
      router      = express.Router(),
      appRoutes   = require('./app/routes/api')(router),
      path        = require('path'),
      mongoose    = require('mongoose'),
      autoIncrement = require('mongoose-auto-increment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use('/api',appRoutes);

mongoose.connect('mongodb://localhost:27017/pv', function(err){
    if(err){
        console.log('not conected '+ err);
    }else{
        console.log('sucessfully connected to mongodb');

    }
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
    console.log('Runing server ' + port);
});
