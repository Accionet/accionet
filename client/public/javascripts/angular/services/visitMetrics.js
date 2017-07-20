/* eslint-disable */

services

  .service('visitMetrics', function($http) {

    this.totalVisitOf = function(_of, id, callback) {
      console.log('llego');
      $http.get('/api/v1/' + _of + '/' + id + '/metrics/visits/count')

      .success(function(results) {
        callback(undefined, results);
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.getTotalEndUsers = function(_of, id, callback) {
      $http.get('/api/v1/' + _of + '/' + id + '/metrics/endusers/count')

      .success(function(results) {
          callback(undefined, results);
        })
        .error(function(data) {
          callback(data);
        });
    };
});
