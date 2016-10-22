const flang = angular.module('flang', []);

flang.service('chartService', function () {
  this.returnType = function (type) {
    if (type == 'pie') {
      return {
        colors: ['#38a', '#222', '#666'],
        series: {
          pie: {
            show: true,
            label: {
              show: false,
              formatter(label, series) {
                return '<div style="font-size:11px;text-align:center;padding:4px;color:white;">' +
                  label + '<br/>' + series.percent + '%</div>';
              },
              threshold: 0.1,
            },
          },
        },
        legend: {
          show: true,
          noColumns: 1, // number of colums in legend table
          labelFormatter: null, // fn: string -> string
          labelBoxBorderColor: '#888', // border color for the little label boxes
          container: null, // container (as jQuery object) to put legend in, null means default on top of graph
          position: 'ne', // position of default legend container within plot
          margin: [5, 10], // distance from grid edge to default legend container within plot
          backgroundOpacity: 0, // set to 0 to avoid background
        },
        grid: {
          hoverable: false,
          clickable: false,
        },
      };
    } else if (type == 'bar') {
      return {
        bars: {
          show: true,
        },
      };
    }
  };
});

flang.directive('flotChart', function (chartService) {
  return {
    restrict: 'E',
    // require: 'ngModel',
    scope: {
      // ngModel: '=',
      chartType: '@',
      chartHeight: '@',
    },
    template: '<div></div>',
    replace: true,
    link(scope, elem, attrs) {
      const attributes = {
        colors: ['#38a', '#222', '#666'],
        series: {
          pie: {
            show: true,
            label: {
              show: false,
              formatter(label, series) {
                return '<div style="font-size:11px;text-align:center;padding:4px;color:white;">' +
                  label + '<br/>' + series.percent + '%</div>';
              },
              threshold: 0.1,
            },
          },
        },
        legend: {
          show: true,
          noColumns: 1, // number of colums in legend table
          labelFormatter: null, // fn: string -> string
          labelBoxBorderColor: '#888', // border color for the little label boxes
          container: null, // container (as jQuery object) to put legend in, null means default on top of graph
          position: 'ne', // position of default legend container within plot
          margin: [5, 10], // distance from grid edge to default legend container within plot
          backgroundOpacity: 0, // set to 0 to avoid background
        },
        grid: {
          hoverable: false,
          clickable: false,
        },
      };
      const data = [{
        label: 'Series1',
        data: Math.random(1, 100),
      }, {
        label: 'Series2',
        data: Math.random(1, 100),
      }, {
        label: 'Series3',
        data: Math.random(1, 100),
      }, {
        label: 'Series4',
        data: Math.random(1, 100),
      }, {
        label: 'Series5',
        data: Math.random(1, 100),
      }, {
        label: 'Series6',
        data: Math.random(1, 100),
      }];
      elem.css('height', 300);
      $.plot(elem, data, attributes);
      elem.show();
    },
  };
});
