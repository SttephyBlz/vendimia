angular.module('clientesServices', [])

  .factory('Cliente', function($http) {
    var clientesFactory = {};

    clientesFactory.all = function(){
      return $http.get('/api/clients/all');
    }

    clientesFactory.new = function(datos){
      console.log(datos);
      return $http.post('/api/clients/new', datos);
    }

    return clientesFactory;
  })

;
