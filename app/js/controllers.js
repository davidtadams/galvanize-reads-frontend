var gEatsControllers = angular.module('gEatsControllers', []);

/*-----------------------------------------------------------------------------
  THIS IS ALL OF THE CONTOLLERS FOR BOOKS
  Search *CONTROLLER_AUTHORS* for authors
  *CONTROLLER_BOOKS*
-----------------------------------------------------------------------------*/
gEatsControllers.controller('BookListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('https://galvanizereads.herokuapp.com/books').success(function(books) {
      $scope.books = books.data;
    });
  }
]);

gEatsControllers.controller('AddBookCtrl', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.authorsToAdd = {};

    $http.get('https://galvanizereads.herokuapp.com/authors').success(function(authors) {
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
        url: 'https://galvanizereads.herokuapp.com/books/new',
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
    $http.get('https://galvanizereads.herokuapp.com/books/' + $routeParams.bookID).success(function(book) {
      $scope.book = book.data[0];
    });

    $scope.deleteBook = function(bookID) {
      $http.delete('https://galvanizereads.herokuapp.com/books/' + bookID + '/delete')
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
    $http.get('https://galvanizereads.herokuapp.com/books/' + $routeParams.bookID).success(function(book) {
      $scope.book = book.data[0];
    });
  }
]);

gEatsControllers.controller('EditBookCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('https://galvanizereads.herokuapp.com/books/' + $routeParams.bookID)
      .success(function(book) {
        $http.get('https://galvanizereads.herokuapp.com/authors')
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
        url: 'https://galvanizereads.herokuapp.com/books/' + $routeParams.bookID + '/edit',
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


/*-----------------------------------------------------------------------------
  THIS IS ALL OF THE CONTOLLERS FOR AUTHORS
  Search *CONTROLLER_BOOKS* for books
  *CONTROLLER_AUTHORS*
-----------------------------------------------------------------------------*/
gEatsControllers.controller('AuthorListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('https://galvanizereads.herokuapp.com/authors').success(function(authors) {
      $scope.authors = authors.data;
    });
  }
]);

gEatsControllers.controller('AddAuthorCtrl', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.booksToAdd = {};

    $http.get('https://galvanizereads.herokuapp.com/books').success(function(books) {
      $scope.books = books.data;
    });

    $scope.submit = function() {
      var books = [];
      for (var prop in $scope.booksToAdd) {
        books.push(prop);
      }

      $http({
        method: 'POST',
        url: 'https://galvanizereads.herokuapp.com/authors/new',
        data: {
          first_name: $scope.author.first_name,
          last_name: $scope.author.last_name,
          portrait_url: $scope.author.portrait_url,
          bio: $scope.author.bio,
          books: books
        }
      }).then(function successCallback(response) {
        console.log('Success adding author: ', response);
        $location.path('/authors');
      }, function errorCallback(response) {
        console.log('Error adding author: ', response);
      });
    };

    $('body').off("click", ".edit-remove-book");
    $('body').off("click", ".edit-add-book");
    $('body').on("click", ".edit-remove-book", removeBook);
    $('body').on("click", ".edit-add-book", addBook);

    function addBook(event) {
      var book = $('.add-book-select').val()
      if (book != null) {
        $('.book-list-placeholder').remove();
        $('option[value="' + book + '"]').remove();

        book = book.split(',');
        $scope.booksToAdd[book[0]] = book[1];

        $('.new-book-list').append('<li class="list-group-item" data-bookid=' +
          book[0] + '><p>' + book[1] +
          '</p><button type="button" name="deleteBookBtn" class="btn btn-danger btn-xs pull-right edit-remove-book">Remove</button></li>'
        );
        $('select').val('Pick a Book');
        $('button[name="deleteBookBtn"]').off('click');
        $('button[name="deleteBookBtn"]').on('click', removeBook);
      }
    }

    function removeBook(event) {
      var bookID = event.currentTarget.parentElement.dataset.bookid;
      var bookTitle = event.currentTarget.previousSibling.innerText;
      delete $scope.booksToAdd[bookID];
      $('.add-book-select').append('<option ng-repeat="book in books" value="' + bookID + ',' + bookTitle + '" ' +
        'class="ng-binding ng-scope">' + bookTitle + '</option>'
      );
      if ($('.new-book-list').children().length <= 1) {
        $(event.currentTarget.parentElement).remove();
        $('.new-book-list').append('<li class="list-group-item book-list-placeholder">Pick a book below</li>');
      } else {
        $(event.currentTarget.parentElement).remove();
      }
    }
  }
]);

gEatsControllers.controller('DeleteAuthorCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('https://galvanizereads.herokuapp.com/authors/' + $routeParams.authorID).success(function(author) {
      $scope.author = author.data[0];
    });

    $scope.deleteAuthor = function(authorID) {
      $http.delete('https://galvanizereads.herokuapp.com/authors/' + authorID + '/delete')
        .then(
          function(response) {
            console.log('Delete successful: ', response);
            $location.path('/authors');
          },
          function(response) {
            console.log('Delete did not work: ', response);
          }
        )
    }
  }
]);

gEatsControllers.controller('AuthorDetailCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('https://galvanizereads.herokuapp.com/authors/' + $routeParams.authorID).success(function(author) {
      $scope.author = author.data[0];
    });
  }
]);

gEatsControllers.controller('EditAuthorCtrl', ['$scope', '$location', '$http', '$routeParams',
  function($scope, $location, $http, $routeParams) {
    $http.get('https://galvanizereads.herokuapp.com/authors/' + $routeParams.authorID)
      .success(function(author) {
        $http.get('https://galvanizereads.herokuapp.com/books')
          .success(function(books) {
            $scope.author = author.data[0];
            //add already existing books to booksToAdd
            $scope.booksToAdd = {};
            for (var i = 0; i < $scope.author.books.length; i++) {
              $scope.booksToAdd[$scope.author.books[i].book_id] =
                  $scope.author.books[i].book_title;
            }
            delete $scope.booksToAdd['No books added'];
            //only add books that are not already on the authors in $scope.books
            $scope.books = books.data.filter(function(value) {
              for (var i = 0; i < $scope.author.books.length; i++) {
                if (value.id === $scope.author.books[i].book_id) {
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
      var books = [];
      for (var prop in $scope.booksToAdd) {
        books.push(prop);
      }

      console.log('this is put data for author: ', $scope.author);
      console.log('this is books array: ', books);

      $http({
        method: 'PUT',
        url: 'https://galvanizereads.herokuapp.com/authors/' + $routeParams.authorID + '/edit',
        data: {
          first_name: $scope.author.first_name,
          last_name: $scope.author.last_name,
          portrait_url: $scope.author.portrait_url,
          bio: $scope.author.bio,
          books: books
        }
      }).then(function successCallback(response) {
        console.log('Success editing author: ', response);
        $location.path('/authors');
      }, function errorCallback(response) {
        console.log('Error editing author: ', response);
      });
    };

    $('body').off("click", ".edit-remove-book");
    $('body').off("click", ".edit-add-book");
    $('body').on("click", ".edit-remove-book", removeBook);
    $('body').on("click", ".edit-add-book", addBook);

    function addBook(event) {
      var book = $('.add-book-select').val()
      if (book != null) {
        $('.book-list-placeholder').remove();
        $('option[value="' + book + '"]').remove();

        book = book.split(',');
        $scope.booksToAdd[book[0]] = book[1];

        $('.new-book-list').append('<li class="list-group-item" data-bookid=' +
          book[0] + '><p>' + book[1] +
          '</p><button type="button" name="deleteBookBtn" class="btn btn-danger btn-xs pull-right edit-remove-book">Remove</button></li>'
        );
        $('select').val('Pick a Book');
        $('button[name="deleteBookBtn"]').off('click');
        $('button[name="deleteBookBtn"]').on('click', removeBook);
      }
    }

    function removeBook(event) {
      var bookID = event.currentTarget.parentElement.dataset.bookid;
      var bookTitle = event.currentTarget.previousSibling.innerText;
      delete $scope.booksToAdd[bookID];
      $('.add-book-select').append('<option ng-repeat="book in books" value="' + bookID + ',' + bookTitle + '" ' +
        'class="ng-binding ng-scope">' + bookTitle + '</option>'
      );
      if ($('.new-book-list').children().length <= 1) {
        $(event.currentTarget.parentElement).remove();
        $('.new-book-list').append('<li class="list-group-item book-list-placeholder">Pick a book below</li>');
      } else {
        $(event.currentTarget.parentElement).remove();
      }
    }
  }
]);
