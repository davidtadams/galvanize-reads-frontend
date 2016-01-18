var gEatsApp = angular.module('gEatsApp', [
  'ngRoute',
  'gEatsControllers'
]);

gEatsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/books', {
        templateUrl: 'partials/all-books.html',
        controller: 'BookListCtrl'
      })
      // .when('/books/:bookID', {
      //   templateUrl: 'partials/one-book.html',
      //   controller: 'BookDeatilCtrl'
      // })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
