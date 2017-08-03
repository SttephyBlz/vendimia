angular.module('clientesController', ['clientesServices'])

  .controller('allClientesCtrl', function($scope, Cliente) {
    var app = this;

    Cliente.all().then(function(data) {
      if(data.data.success){
        app.clientes = data.data.clients;
      }
    });
  })

  .controller('newClientsCtrl', function($scope, $timeout, $location, $http, Cliente) {
    var app = this;


    this.nuevo = function (datos){
      app.errorMsg = false;

      Cliente.new(app.datos).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message + '. Redireccionando. . .';

          $timeout(function() {
            $location.path('/clientes');
          }, 3000);
        }else{
          app.errorMsg = data.data.message;
        }
      });
    };
  })
;
