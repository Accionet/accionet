controllers

    .controller('loginController', function($scope, $http) {


    $scope.user = {
        mail: null,
        password: null
    };

    $scope.validForm = function() {
        return !($scope.form.$error.required || $scope.form.$error.maxlength || $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
    };


    $scope.login = function() {
      if($scope.validForm && $scope.user.mail && $scope.user.password){
          console.log("valid login");
      }
    };




});
