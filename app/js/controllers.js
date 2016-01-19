var gEatsControllers = angular.module('gEatsControllers', []);

gEatsControllers.controller('BookListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('http://localhost:3000/books').success(function(books) {
      $scope.books = books.data;
    });
  }
]);

gEatsControllers.controller('AddBookCtrl', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.authorsToAdd = {};

    $http.get('http://localhost:3000/authors').success(function(authors) {
      $scope.authors = authors.data;
    });

    $scope.addAuthor = function(author) {
      $('.author-list-placeholder').remove();
      $('option[value="' + author + '"]').remove();

      author = author.split(',');
      $scope.authorsToAdd[author[0]] = author[1];

      $('.new-author-list').append('<li class="list-group-item" data-authorid=' +
        author[0] + '>' + author[1] +
        '<button type="button" name="deleteAuthorBtn" class="btn btn-danger btn-xs pull-right">Remove</button></li>'
      );
      $('select').val('Pick an Author');
      $('button[name="deleteAuthorBtn"]').off('click');
      $('button[name="deleteAuthorBtn"]').on('click', removeAuthor);
    };

    $scope.submit = function() {
      var authors = [];
      for (var prop in $scope.authorsToAdd) {
        authors.push(prop);
      }

      $http({
        method: 'POST',
        url: 'http://localhost:3000/books/new',
        data: {
          title: $scope.book.title,
          genre: $scope.book.genre,
          cover_url: $scope.book.coverUrl,
          description: $scope.book.description,
          authors: authors
        }
      }).then(function successCallback(response) {
        console.log('Success adding book: ', response);
        $location.path('/books');
      }, function errorCallback(response) {
        console.log('Error adding book: ', response);
      });
    };

    function removeAuthor(event) {
      var authorID = event.currentTarget.parentElement.dataset.authorid;
      var authorName = event.currentTarget.previousSibling.data;
      $('.add-author-select').append('<option ng-repeat="author in authors" value="' + authorID + ',' + authorName + '" ' +
        'class="ng-binding ng-scope">' + authorName + '</option>'
      );
      if ($('.new-author-list').children().length <= 1) {
        $(event.currentTarget.parentElement).remove();
        $('.new-author-list').append('<li class="list-group-item author-list-placeholder">Pick an author below</li>');
      } else {
        $(event.currentTarget.parentElement).remove();
      }
    }
  }
]);

gEatsControllers.controller('DeleteBookCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('http://localhost:3000/books/' + $routeParams.bookID).success(function(book) {
      $scope.book = book.data[0];
    });

    $scope.deleteBook = function(bookID) {
      $http.delete('http://localhost:3000/books/' + bookID + '/delete')
        .then(
          function(response) {
            console.log('Delete successful: ', response);
            $location.path('/books');
          },
          function(response) {
            console.log('Delete did not work: ', response);
          }
        )
    }
  }
]);

gEatsControllers.controller('BookDeatilCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('http://localhost:3000/books/' + $routeParams.bookID).success(function(book) {
      $scope.book = book.data[0];
    });
  }
]);

gEatsControllers.controller('EditBookCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('http://localhost:3000/books/' + $routeParams.bookID)
      .success(function(book) {
        $http.get('http://localhost:3000/authors')
          .success(function(authors) {
            $scope.book = book.data[0];
            //add already existing authors to authorsToAdd
            $scope.authorsToAdd = {};
            for (var i = 0; i < $scope.book.authors.length; i++) {
              $scope.authorsToAdd[$scope.book.authors[i].author_id] =
                  $scope.book.authors[i].first_name + ' '
                  + $scope.book.authors[i].last_name;
            }
            delete $scope.authorsToAdd['No authors added'];
            //only add authors that are not already on the book in $scope.authors
            $scope.authors = authors.data.filter(function(value) {
              for (var i = 0; i < $scope.book.authors.length; i++) {
                if (value.id === $scope.book.authors[i].author_id) {
                  return false;
                }
              }
              return true;
            });
          }
        );
      }
    );

    $scope.submit = function() {
      var authors = [];
      for (var prop in $scope.authorsToAdd) {
        authors.push(prop);
      }

      $http({
        method: 'PUT',
        url: 'http://localhost:3000/books/' + $routeParams.bookID + '/edit',
        data: {
          title: $scope.book.title,
          genre: $scope.book.genre,
          cover_url: $scope.book.cover_url,
          description: $scope.book.description,
          authors: authors
        }
      }).then(function successCallback(response) {
        console.log('Success editing book: ', response);
        $location.path('/books');
      }, function errorCallback(response) {
        console.log('Error editing book: ', response);
      });
    };

    $('body').off("click", ".edit-remove-author");
    $('body').off("click", ".edit-add-author");
    $('body').on("click", ".edit-remove-author", removeAuthor);
    $('body').on("click", ".edit-add-author", addAuthor);

    function addAuthor(event) {
      var author = $('.add-author-select').val()
      if (author != null) {
        $('.author-list-placeholder').remove();
        $('option[value="' + author + '"]').remove();

        author = author.split(',');
        $scope.authorsToAdd[author[0]] = author[1];

        $('.new-author-list').append('<li class="list-group-item" data-authorid=' +
          author[0] + '>' + author[1] +
          '<button type="button" name="deleteAuthorBtn" class="btn btn-danger btn-xs pull-right">Remove</button></li>'
        );
        $('select').val('Pick an Author');
        $('button[name="deleteAuthorBtn"]').off('click');
        $('button[name="deleteAuthorBtn"]').on('click', removeAuthor);
      }
    }

    function removeAuthor(event) {
      var authorID = event.currentTarget.parentElement.dataset.authorid;
      var authorName = event.currentTarget.previousSibling.data;
      delete $scope.authorsToAdd[authorID];
      $('.add-author-select').append('<option ng-repeat="author in authors" value="' + authorID + ',' + authorName + '" ' +
        'class="ng-binding ng-scope">' + authorName + '</option>'
      );
      if ($('.new-author-list').children().length <= 1) {
        $(event.currentTarget.parentElement).remove();
        $('.new-author-list').append('<li class="list-group-item author-list-placeholder">Pick an author below</li>');
      } else {
        $(event.currentTarget.parentElement).remove();
      }
    }
  }
]);
