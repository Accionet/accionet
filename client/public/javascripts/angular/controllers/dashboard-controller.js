// public/javascripts/angular/controllers
/* eslint-disable */
controllers

  .controller('dashboardController', function($scope, $http) {
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
        $scope[entry].count = toSimpleString(data.amount);
        $scope[entry].loading = false;
      })
      .error(function error() {});
  };

  function roundDecimal(num) {
    return Math.round(num * 10) / 10;
  }

  function toSimpleString(amount) {
    const one_million = 1000000;
    const one_thousand = 1000;
    const ten_thousand = 10000;
    const fifty_million = 5000000;

    amount = parseInt(amount, 10);
    if (amount >= fifty_million) {
      return '>50M';
    }
    if (amount >= one_million) {
      amount = amount / one_million;
      return roundDecimal(amount) + 'M';
    }
    if (amount >= ten_thousand) {
      amount = amount / one_thousand;
      return Math.round(amount) + 'K';
    }
    if (amount >= one_thousand) {
      amount = amount / one_thousand;
      return roundDecimal(amount) + 'K';
    }
    return amount;
  }
});
