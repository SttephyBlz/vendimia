angular.module('articulosServices', [])

  .factory('Articulo', function($http){
    var articuloFactory = {};

    articuloFactory.all = function(){
      return $http.get('/api/articles/all');
    }
    articuloFactory.new = function(datos){
      return $http.post('/api/articles/new', datos);
    }
    return articuloFactory;
  })
;
