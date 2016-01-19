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
      .when('/book/new', {
        templateUrl: 'partials/new-book.html',
        controller: 'AddBookCtrl'
      })
      .when('/book/:bookID/delete', {
        templateUrl: 'partials/delete-book.html',
        controller: 'DeleteBookCtrl'
      })
      // .when('/books/:bookID/edit', {
      //   templateUrl: '',
      //   controller: ''
      // })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
