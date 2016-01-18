var gEatsApp = angular.module('gEatsApp', [
  'ngRoute',
  'gEatsControllers'
]);

gEatsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/landing.html'
      })
      .when('/books', {
        templateUrl: 'partials/all-books.html',
        controller: 'BookListCtrl'
      })
      // .when('/books/:bookID', {
      //   templateUrl: 'partials/one-book.html',
      //   controller: 'BookDeatilCtrl'
      // })
      .when('/books/new', {
        templateUrl: 'partials/new-book.html',
        controller: 'AddBookCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
