const app = angular.module('accionet-web-app', ['app.controllers']);


const INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function validate() {
    return {
        require: 'ngModel',
        link(scope, elm, attrs, ctrl) {
            ctrl.$validators.integer = function validate(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
                    return true;
                }

                if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
                    return true;
                }

        // it is invalid
                return false;
            };
        },
    };
});
