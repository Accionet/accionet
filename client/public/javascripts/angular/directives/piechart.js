directives

    .directive('pieChart', function () {
        return {
            restrict: 'E',
        // require: 'ngModel',
        // scope: {
        //     ngModel: '=',
        //     chartType: '@',
        //     chartHeight: '@',
        // },
            template: '<div></div>',
            replace: true,
            link(scope, elem, attrs) {
                const data = JSON.parse(attrs.ngData);
            // scope.$watch('ngModel', function(model){
            //     if(model) {

                elem.css('height', 400);
                $.plot(elem, data, {
                    series: {
                        pie: {
                            show: true,
                        },
                    },
                    grid: {
                        hoverable: true,
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
                        shifts: {
                            x: 20,
                            y: 0,
                        },
                        defaultTheme: false,
                    },
                });
                // elem.show();
            //     }
            // });
            },
        };
    });
