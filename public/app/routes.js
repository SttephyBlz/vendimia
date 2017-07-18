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

    .otherwise({redirectTo : '/'})

    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
