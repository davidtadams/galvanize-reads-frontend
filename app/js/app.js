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
      .when('/book/:bookID', {
        templateUrl: 'partials/one-book.html',
        controller: 'BookDeatilCtrl'
      })
      .when('/book/add/new', {
        templateUrl: 'partials/new-book.html',
        controller: 'AddBookCtrl'
      })
      .when('/book/:bookID/delete', {
        templateUrl: 'partials/delete-book.html',
        controller: 'DeleteBookCtrl'
      })
      .when('/book/:bookID/edit', {
        templateUrl: 'partials/edit-book.html',
        controller: 'EditBookCtrl'
      })
      .when('/authors', {
        templateUrl: 'partials/all-authors.html',
        controller: 'AuthorListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
