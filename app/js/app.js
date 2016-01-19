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
      .when('/author/:authorID', {
        templateUrl: 'partials/one-author.html',
        controller: 'AuthorDetailCtrl'
      })
      .when('/author/add/new', {
        templateUrl: 'partials/new-author.html',
        controller: 'AddAuthorCtrl'
      })
      .when('/author/:authorID/delete', {
        templateUrl: 'partials/delete-author.html',
        controller: 'DeleteAuthorCtrl'
      })
      .when('/author/:authorID/edit', {
      templateUrl: 'partials/edit-author.html',
      controller: 'EditAuthorCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
