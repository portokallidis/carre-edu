'use strict';

angular.module('edumaterialApp')
  .controller('WikipediaCtrl', function($scope, $http, Auth, suggest, $location, $sce, $timeout) {

    //initialize setup vars
    $scope.itemsPerPage = 20
    $scope.currentPage = 1;

    function init() {
      //load from state or instantiate
      $scope.total = 0;
      $scope.results = [];

      //check if global search term is present
      if (Auth.searchQuery) {
        $scope.queryTerm = Auth.searchQuery;
        $scope.searchTerm();
      }
    }

    //did you mean? function
    $scope.suggest = function(suggestion) {
      $scope.queryTerm = suggestion;
      $scope.searchTerm();
    };

    //===autocomple helpers===//
    $scope.getSuggestions = function(val) {
      return suggest.for(val);
    };

    $scope.onComplete = function(label) {
      if (label) {
        $scope.queryTerm = label;
        $scope.searchTerm();
      }
    };


    //fetch whole article and rate it
    $scope.toggleArticle = function(i) {

      if (!$scope.showArticle && $scope.results[i].title) {

        $scope.showArticle = true;
        $scope.doc = $scope.results[i];
        var title = $scope.doc.title;
        $timeout(function() {
          
          $scope.doc.iframe = htmlSafe('http://en.wikipedia.org/wiki/' + encodeURI(title).split('%20').join('_'), true);
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';

        }, 500);

        //load the article
        $http.get('/api/wikipedia/article/' + encodeURI(title), {
          cache: true
        }).then(function(response) {
          //http://www.nlm.nih.gov/medlineplus
          $scope.doc.fetched = response.data.text['*'];


        }).then(function() {

        });
      }
      else {
        $scope.doc.iframe = htmlSafe('', false);
        $scope.showArticle = false;
        $timeout(function() {

          // var style = document.querySelector('body').style.overflowY;
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';

        }, 100);

      }

    };
    
    $scope.articleInfo="ICD-10 : 230444";
    $scope.articleRating="Information Quality";
    


    var htmlSafe = function(data, iframe) {
      var sandbox = '';
      if (iframe) {
        if (data.search("medlineplus") > 0) sandbox = 'sandbox="allow-same-origin"';
        data = '<iframe style="width:100%;" class="embed-responsive-item" src="' + data + '"' + sandbox + '></iframe>';
      }
      return $sce.trustAsHtml(data);
    }

    //perform search
    $scope.searchTerm = function(page) {
      if (!page) $scope.currentPage = 1;
      $http.get('/api/wikipedia/search/' + encodeURI($scope.queryTerm) + '/' + ($scope.currentPage - 1) * $scope.itemsPerPage, {
        cache: true
      }).then(function(response) {
        $scope.results = response.data.search;
        $scope.total = response.data.searchinfo.totalhits;
        $scope.pageCount = Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.suggestion = response.data.searchinfo.suggestion;
      });

    };


    //perform initialization
    init();

  });