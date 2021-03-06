'use strict';

angular.module('edumaterialApp')
  .controller('DbpediaCtrl', function ($http,$scope,Auth) {
    
    //initialize setup vars
      
      $scope.itemsPerPage = 10;
      $scope.currentPage = 1;
      
    function init(){
      //load from state or instantiate
      $scope.total=0;
      $scope.results=[];
      $scope.filteredResults=[];
      
    }
    
    
    //perform initialization
    init();
    
    $scope.searchTerm=function() {
      init();
      $http.get('/api/dbpedia/term/'+encodeURI($scope.queryTerm)+'/en', {cache:true}).then(function(response){
        $scope.results = response.data;
        $scope.total = $scope.results.length;
        $scope.pageCount=Math.ceil($scope.total / $scope.itemsPerPage);
        
        
        if($scope.total>0){
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;
            $scope.filteredResults = $scope.results.slice(begin, end);
            
            // $rootScope.dbpedia.filteredResults = $scope.filteredResults;
          });
        } else {
          $scope.filteredResults=[];
          
          //save state
          // $rootScope.dbpedia.filteredResults = $scope.filteredResults;

        }
        
        //save state
        // $rootScope.dbpedia.results=$scope.results;
        // $rootScope.dbpedia.total=$scope.total;
        // $rootScope.dbpedia.pageCount=$scope.pageCount;
      
      });
    };
    
    
      //check if global search term is present
      if(Auth.searchQuery){
        $scope.queryTerm=Auth.searchQuery;
        $scope.searchTerm();
      }
    
  });
