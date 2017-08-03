angular.module('myapp',
  ['appRoutes',
   'ngAnimate',
   'mainController',
   'mainServices',
   'clientesController',
   'clientesServices',
   'articulosController',
   'articulosServices',
   'autocompleteDemo']
 )

 .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);
