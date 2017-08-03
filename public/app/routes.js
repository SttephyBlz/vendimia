var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',{
      templateUrl: 'app/views/pages/home.html'
    })

    .when('/ventas',{
      templateUrl: 'app/views/pages/ventas.html'
    })

    .when('/nueva-venta',{
      templateUrl: 'app/views/pages/nuevaventa.html'
    })

    .when('/clientes',{
      templateUrl: 'app/views/pages/clientes.html'
    })

    .when('/nuevo-cliente',{
      templateUrl: 'app/views/pages/nuevocliente.html',
      controller: 'newClientsCtrl',
      controllerAs: 'newClientsCtrl'
    })

    .when('/articulos',{
      templateUrl: 'app/views/pages/articulos.html'
    })

    .when('/nuevo-articulo',{
      templateUrl: 'app/views/pages/nuevoarticulo.html',
      controller: 'newArticleCtrl',
      controllerAs: 'newArticleCtrl'
    })

    .otherwise({redirectTo : '/'})

    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
