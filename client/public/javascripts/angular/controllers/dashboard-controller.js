// public/javascripts/angular/controllers
/* eslint-disable */
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

        $scope.visits = {
            loading: true,
            count: undefined,
        };

        $scope.responses = {
            loading: true,
            count: undefined,
        };


        $scope.count = function getAmountOf(entry) {
            $scope[entry].loading = true;
            $http.get(`/${entry}/count`)
            .success(function success(data) {
                $scope[entry].count = data.amount;
                $scope[entry].loading = false;
            })
            .error(function error() { });
        };
    });
