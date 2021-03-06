'use strict';

angular.module('edumaterialApp')
  .factory('suggest', function ($http) {
    // Service logic
    var getSuggestions=function(val){
      if(val.length>2) {
        return $http.get('/api/wikipedia/autocomplete/'+encodeURI(val), {cache:true,ignoreLoadingBar: true}).then(function(response){
          if(response.data.length>1) return response.data; else return [];
        });
      } else return []; 
    };    
    
    var sparqlRiskElements=function(){
        return $http.get('/api/riskelements', {cache:true,ignoreLoadingBar: true}).then(function(response){
          if(response.data.length>1) return response.data; else return [];
        });
    };
    
    // Public API here
    return {
      'for': getSuggestions,
      'riskelements': sparqlRiskElements
    };
  });
