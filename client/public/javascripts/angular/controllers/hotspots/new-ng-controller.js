/* eslint-disable */

controllers

  .controller('newHotspotController', function($scope, $http) {
  $scope.IMAGE_TEMPLATE = {
    template: "",
    defaultValues: "",
    compiledHTML: "",
  };


  // getTemplate
  $scope.getTemplate = function(template) {
    $http.get('/hotspots/template/' + template)
      .success(function(data) {
        $scope.IMAGE_TEMPLATE.template = data.htmlData;
        $scope.IMAGE_TEMPLATE.values = JSON.parse(data.defaultValues);
        $scope.compile($scope.IMAGE_TEMPLATE);
      })
      .error(function(error) {
        console.log(error);
      });
  };

  $scope.compile = function(fileToCompile) {
    var temp = fileToCompile.template;
    keys = Object.keys(fileToCompile.values);
    for (var i = 0; i < keys.length; i++) {
      var inTextKey = "$" + keys[i] + "$";
      console.log(inTextKey);
      temp = temp.replace(inTextKey, fileToCompile.values[keys[i]]);
    }
    console.log(temp);
  };


  $scope.getTemplate("image");
});
