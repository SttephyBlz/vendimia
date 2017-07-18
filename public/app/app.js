angular.module('myapp',
  ['appRoutes',
   'ngAnimate',
   'mainController',
   'mainServices',
 'autocompleteDemo'])
 
 .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);
