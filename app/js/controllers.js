var gEatsControllers = angular.module('gEatsControllers', []);

gEatsControllers.controller('BookListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('http://localhost:3000/books').success(function(books) {
      console.log(books);
      $scope.books = books.data;
    });
  }
]);
