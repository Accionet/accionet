/* eslint-disable */

services

  .service('visitMetrics', function($http) {

    this.totalVisitOf = function(table, id, callback) {
      console.log('llego');
      $http.get('/api/v1/' + table + '/' + id + '/metrics/visits/count')

      .success(function(results) {
        callback(undefined, results);
        })
        .error(function(data) {
          callback(data);
        });
    }
});
