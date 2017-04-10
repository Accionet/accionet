/* eslint-disable */
controllers

  .controller('userController', function($scope, $http, $window) {
  $scope.users = {};
  $scope.selectedUser = null;
  $scope.metrics = {};
  $scope.loadingVisitsByDayChart = true;
  $scope.loadingVisitsByHourChart = true;
  $scope.loadingVisitsByDayAndHourChart = true;
  $scope.loadingAccesables = true;
  $scope.accessTo = [];
  $scope.places = [];
  $scope.surveys = [];

  let surveysLoaded = false;
  let placesLoaded = false;

  const SURVEYS = 0;
  const PLACES =1;




  // Get all users
  $scope.initializeUsers = function(users, selectedUser) {
    if (users) {
      $scope.users = JSON.parse(users);
    }
    if (selectedUser) {
      $scope.selectedUser = JSON.parse(selectedUser);
    }
  };

  $scope.initializeMetrics = function(metrics) {
    if (metrics) {
      $scope.metrics = JSON.parse(metrics);
    }
  };


  $scope.getKeys = function(json) {
    return Object.keys(json);
  };


  $scope.toggleIsActive = function(user) {
    $http.put(`/users/${user.id}/toggleIsActive`)
      .success(function(data) {
        console.log(data);
        locallyUpdateUser(data.user);
      })
      .error(function(data) {
        console.log(data);
      });
  };


  function locallyUpdateUser(updated_user) {
    for (let i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].id == updated_user.id) {
        $scope.users[i] = updated_user;
      }
    }
  }

  // Create a new user
  $scope.createUser = function() {
    $scope.selectedUser.access = $scope.accessTo;
    if ($scope.validForm()) {
      $http.post('/users/new', $scope.selectedUser)
        .success(function(data) {
          $scope.formData = {};
          $scope.users = data;
          console.log($scope.selectedUser);
          $window.location.href = '/users/';
        })
        .error(function(error) {
          console.log('hola');
          console.log(error);
        });
    }
  };

  // updates a user
  $scope.updateUser = function(user) {
    console.log('meneh');
    console.log('ir a buscar');
    $http.put('/users/' + $scope.selectedUser.id + '/edit', $scope.selectedUser)
      .success(function(data) {
        user = data.user;
        console.log(user);
        $window.location.href = '/users/';
      })
      .error(function(error) {
        console.log(error);
      });
  };

  $scope.passwordMatch = function() {
    return $scope.selectedUser.password === $scope.password_verify;
  }

  $scope.validForm = function(skipPassword) {
    return !($scope.form.$error.required || $scope.form.$error.maxlength ||
      $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer || !($scope.passwordMatch() || skipPassword));
  };


  $scope.setSelectedUser = function(user) {
    $scope.selectedUser = user;
  };


  // metrics

  const options = {
    xaxis: {
      mode: 'time',
      minTickSize: [1, 'hour'],
    },
    series: {
      lines: {
        show: true,
      },
      points: {
        show: false,
      },
    },
    grid: {
      hoverable: true, // IMPORTANT! this is needed for tooltip to work
    },
    tooltip: true,
    // tooltipOpts: {
    //     content: '%y respuestas',
    //     shifts: {
    //         x: -60,
    //         y: 25,
    //     },
    // },

  };

  $scope.getVisitsByDay = function(user) {
    $http.get('/api/v1/users/' + user.id + '/metrics/visits/daily')
      .success(function(results) {
        const data = results.data;
        $scope.loadingVisitsByDayChart = false;

        const newData = [data[0]];

        for (let i = 1; i < data.length; i++) {
          const d1 = data[i - 1][0];
          const d2 = data[i][0];
          const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
          const startDate = new Date(data[i - 1][0]);
          if (diff > 1) {
            for (let j = 0; j < diff - 1; j++) {
              const fillDate = new Date(startDate).setDate(startDate.getDate() + (j + 1));
              newData.push([fillDate, 0]);
            }
          }
          newData.push(data[i]);
        }

        const d = newData;


        $.plot('#visits-by-day-line-chart', [d], options);
      })
      .error(function(data) {
        $scope.loadingVisitsByDayChart = false;
        $.plot('#visits-by-day-line-chart', [], options);


      });
  };

  $scope.getVisitsByHour = function(user) {
    $http.get('/api/v1/users/' + user.id + '/metrics/visits/hourly')
      .success(function(results) {
        const d = results.data;
        // get Offset
        const offset = new Date().getTimezoneOffset();
        for (let i = 0; i < d.length; i++) {
          d[i][0] -= (offset * 60 * 1000);
        }
        $scope.loadingVisitsByHourChart = false;
        $.plot('#visits-by-hour-line-chart', [d], options);
      })
      .error(function(data) {
        console.log(data);
        $scope.loadingVisitsByHourChart = false;
        $.plot('#visits-by-hour-line-chart', [], options);
      });
  };
  $scope.getVisitsByDayAndHour = function(user) {
    $http.get('/api/v1/users/' + user.id + '/metrics/visits/dayandhour')
      .success(function(results) {
        const d = results.data;
        // get Offset
        const offset = new Date().getTimezoneOffset();
        for (let i = 0; i < d.length; i++) {
          d[i].data[0] -= (offset * 60 * 1000);
        }
        $scope.loadingVisitsByDayAndHourChart = false;
        $.plot('#visits-by-day-and-hour-line-chart', d, options);
      })
      .error(function(data) {
        $scope.loadingVisitsByDayAndHourChart = false;
        $.plot('#visits-by-day-and-hour-line-chart', [], options);
      });
  };


  $scope.getTotalVisits = function(user) {
    $http.get('/api/v1/users/' + user.id + '/metrics/visits/count')

    .success(function(results) {
        user.totalVisits = results.data;
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(results.date);
        const secondDate = new Date();


        const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        user.totalDays = diffDays;
      })
      .error(function(data) {
        user.totalVisits = '?';
      });
  };

  $scope.getTotalEndUsers = function(user) {
    $http.get('/api/v1/users/' + user.id + '/metrics/endusers/count')

    .success(function(results) {
        user.totalEndUsers = results.data.toString();
      })
      .error(function(data) {
        user.totalEndUsers = '?';

      });
  };


  //Acesss
  $scope.addNewAccess = function() {
    $scope.accessTo.push({});
  }

  //Remove access from array
  $scope.removeAccess = function(i) {
    $scope.accessTo.splice(i, 1);
  }

  $scope.registerAccess = function(access, accessTo) {
    var temp = JSON.parse(accessTo);
    access.in = temp.in;
    access.to = temp.to;

  }

  $scope.accessWellDefined = function() {
    for (var i = 0; i < $scope.accessTo.length; i++) {
      var everythingDefined = $scope.accessTo[i].to && $scope.accessTo[i].to && $scope.accessTo[i].accessType;
      if (!(everythingDefined)) {
        return false;
      }
    }
    return true;
  }

  $scope.loadAccesables = function() {
    load('/api/v1/surveys/all/names', 'surveys', surveysLoaded);
    load('/api/v1/places/all/names', 'places', placesLoaded);

  }

  function load(route, saveIn, changeBoolean) {
    $http.get(route)
    .success(function(results) {
      // saveData(results.data, whatToLoad);
      $scope[saveIn] = results.data;
      changeBoolean = true;
      $scope.loadingAccesables = surveysLoaded && placesLoaded;
      })
      .error(function(data) {

      });
  }

});
