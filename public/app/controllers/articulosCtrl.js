angular.module('articulosController', ['articulosServices'])

  .controller('allArticulosCtrl', function($scope, Articulo){
    var app = this;

    Articulo.all().then(function(data){
      if(data.data.success){
        app.articulos = data.data.articles;
      }
    });

  })

  .controller('newArticleCtrl', function($scope, $http, $timeout, $location, Articulo){
    var app = this;

    this.nuevo = function(datos){
      app.errorMsg = false;

      Articulo.new(app.datos).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message + '. Redireccionando. . .';
          $timeout(function () {
            $location.path('/articulos');
          }, 3000);
        }else{
          app.errorMsg = data.data.message;
        }
      });
    };

  })
;
