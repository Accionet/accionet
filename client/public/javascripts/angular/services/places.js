/* eslint-disable */

services

  .service('placeService', function($http) {
      this.getNames = function ( callback) {
        $http.get('/api/v1/places/all/names')
          .success(function(results) {
            callback(null, results.data);
          })
          .error(function(data) {
            callback(data);
          });
      }
// services.service('placeService', function($scope, $http, $window) {

});
