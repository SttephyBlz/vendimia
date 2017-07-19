angular.module('mainServices', [])

  .factory('ClientsRetriever', function($http) {
    var ClientsRetriever = {};

    ClientsRetriever.all = function(){
      return $http.get('/api/clients/all');
    }

    return ClientsRetriever;
  })

  .factory('ArticlesRetriever', function($http) {
    var ArticlesRetriever = {};

    ArticlesRetriever.all = function(){
      return $http.get('/api/articles/all');
    }

    ArticlesRetriever.newExistencia = function(data){
      return $http.post('/api/articles/e', data);
    }

    return ArticlesRetriever;
  })

  .factory('Config', function($http) {
    var config = {};

    config.conf = function() {
      return $http.get('/api/config');
    }

    return config;
  })

  .factory('NextSale', function($http) {
    var nextSale = {};

    nextSale.n = function() {
      return $http.get('/api/sales/next');
    }

    return nextSale;
  })

  .factory('allSales', function($http) {
    var sale = {};

    sale.all = function() {
      return $http.get('/api/sales/all');
    }

    return sale;
  })

  .factory('saveSale', function($http) {
    var sale = {};

    //User.create(regData)
    sale.create = function(regData){
      return $http.post('/api/sale/new', regData);
    };

    return sale;
  })
;

/*

.factory('MovieRetriever', function($http, $q, $timeout){
  var MovieRetriever = new Object();

  MovieRetriever.getmovies = function(i) {
    var moviedata = $q.defer();
    var movies;

    var someMovies = ["Juan C", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

    var moreMovies = ["Juan C", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

    if(i && i.indexOf('T')!=-1)
      movies=moreMovies;
    else
      movies=moreMovies;

    $timeout(function(){
      moviedata.resolve(movies);
    },1000);

    return moviedata.promise
  }

  return MovieRetriever;
})

*/
