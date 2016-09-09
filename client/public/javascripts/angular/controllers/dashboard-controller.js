// public/javascripts/angular/controllers

controllers

    .controller('dashboardController', function ($scope, $http) {
        $scope.places = {
            loading: true,
            count: undefined,
        };
        $scope.surveys = {
            loading: true,
            count: undefined,
        };
        $scope.countPlaces = function getAmountOfPlaces() {
            $scope.places.loading = true;
            $http.get('/places/count')
          .success(function setPlaces(data) {
              $scope.places.count = data.amount;
              $scope.places.loading = false;
          })
          .error(function error() {
          });
        };


        $scope.countSurveys = function getAmountOfSurveys() {
            $scope.surveys.loading = true;
            $http.get('/surveys/count')
          .success(function setSurveys(data) {
              $scope.surveys.count = data.amount;
              $scope.surveys.loading = false;
          })
          .error(function error() {
          });
        };
    });
