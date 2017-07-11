/*eslint-disable*/
directives

  .directive('porcentageInput', function($compile) {
    console.log();
  return {
    require: "?ngModel",
    scope: {
      myDirectiveVar: '=',
      //bindAttr: '='
    },
    template: '<input type="text" ng-model="h"  class="form-control" ng-change = "updateModel(h)"  />',
    replace: true,
    //require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      m = attr.model;
      console.log(m);
      scope.updateModel = function(item) {
        console.log(m);
        ngModel.$setViewValue('holasss');
        ngModel.$render()
        }
        //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
        // $compile(textField)($scope.$parent);
    }
  };
});
