/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, $location, Utils, placeService) {

  $scope.i = 1; // current_step
  $scope.selectedHotspot;
  $scope.places;
  $scope.loadingPlaces = true;
  $scope.loadPlacesFailed = false;
  $scope.completed = 0;
  $scope.TEMPLATE = 'LANDING-PAGE';
  $scope.FILE_KEYS = ['IMAGE-PATH', 'BACKGROUND-IMAGE']; //FIXME


  // Get all places
  $scope.initializeHotspot = function(hotspot) {
    $scope.selectedHotspot = Utils.parseJson(hotspot);

  };

  function toggleClass(id, className) {
    $(function() {
      $('#' + id.toString()).toggleClass(className);
    });
  }

  function allowedToGoToNextStep() {
    if ($scope.i >= 3) {
      return false;
    }
    if ($scope.i == 1 && !($scope.selectedHotspot.place_id && $scope.selectedHotspot.name)) {
      return false;
    }
    return true
  }

  $scope.nextStep = function() {
    if (allowedToGoToNextStep()) {

      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i += 1;
      toggleClass($scope.i, className);
      if ($scope.i == 2) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 3) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.previousStep = function() {
    if ($scope.i > 1) {
      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i -= 1;
      toggleClass($scope.i, className);
      if ($scope.i == 1) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 2) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.getPlaces = function() {

    placeService.getNames(function(err, places) {
      $scope.loadingPlaces = false;
      if (err) {
        $scope.loadPlacesFailed = true;
        return;
      }
      $scope.places = places;
    })
  }

  $scope.getPlaces();
  // -------------------------------------------TEMPLATE AREA ------------------------------------------------
  $scope.IMAGE_TEMPLATE = {
    template: "",
    defaultValues: "",
    compiledHTML: "",
  };

  $scope.current_hotspot;


  // getTemplate
  $scope.getTemplate = function(template, makeCurrent) {
    $http.get('/hotspots/template/' + template)
      .success(function(data) {
        $scope.IMAGE_TEMPLATE.template = data.htmlData;
        $scope.IMAGE_TEMPLATE.values = Utils.parseJson(data.defaultValues);
        $scope.compile($scope.IMAGE_TEMPLATE, makeCurrent);
      })
      .error(function(error) {
        console.log(error);
      });
  };

  $scope.compile = function(fileToCompile, makeCurrent) {
    var temp = fileToCompile.template;
    keys = Object.keys(fileToCompile.values);
    for (var i = 0; i < keys.length; i++) {
      var inTextKey = "\\$" + keys[i] + "\\$";
      var search = new RegExp(inTextKey, 'g')
      temp = temp.replace(search, fileToCompile.values[keys[i]]);
    }
    fileToCompile.compiledHTML = temp;
    if (makeCurrent) {
      $scope.current_hotspot = fileToCompile;
      $scope.renderHotspot();
    }
  };

  $scope.renderHotspot = function() {
    var text = $scope.current_hotspot.compiledHTML;
    $(function() {
      $('#hotspot').remove();
      var iframe = $('<iframe frameborder="0" name="hotspot" id="hotspot"> </iframe>');
      iframe.appendTo('#hotspotContainer');
      var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
      iframewindow.document.open();
      iframewindow.document.write(text);
      iframewindow.document.close();
    });
  }

  $scope.recompile = function(key, value) {
    if (key in $scope.current_hotspot.values) {
      $scope.current_hotspot.values[key] = value;
    }
    $scope.compile($scope.current_hotspot, true);
  }

  function changeValueInDirection(value, direction) {
    var diff = 0.1;
    if (direction === 'up') {
      return (parseFloat(value, 10) + diff).toFixed(2);
    } else {
      return (parseFloat(value, 10) - diff).toFixed(2);

    }
  }
  $scope.recompileSize = function(key, direction) {
    if (key in $scope.current_hotspot.values) {
      var value = $scope.current_hotspot.values[key];
      value = value.replace('em', '');
      value = changeValueInDirection(value, direction)
      value = value + 'em';
      $scope.current_hotspot.values[key] = value;
    }
    $scope.compile($scope.current_hotspot, true);
  }

  function parseValuesToSend() {
    temp = $scope.current_hotspot.values;
    temp['IMAGE-PATH'] = "IMAGE-PATH";
    temp['BACKGROUND-IMAGE'] = "BACKGROUND-IMAGE";
    return temp;
  }

  $scope.saveHotspot = function() {
    $scope.completed = 0;
    canceled = false;
    var values = parseValuesToSend();
    console.log(values);
    $scope.selectedHotspot.template = "LANDING-PAGE";
    $http.post('/hotspots/save/', {
        template_id: $scope.TEMPLATE,
        hotspotInfo: $scope.selectedHotspot,
        template: $scope.current_hotspot.template,
        values: values,
      })
      .success(function(data) {
        console.log('se guardo en heroku');
        changeCompleted(10);
        var path = data.imageFolder;
        uploadFiles(path);
      })
      .error(function(error) {});
  }


var filesToSend = 0;
var uploadedFiles = 0;

  function uploadFiles(path) {
    filesToSend = 0;
    uploadedFiles = 0;
    if (!canceled) {
      progressPerFile = 80 / $scope.FILE_KEYS.length;
      for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
        var file = document.getElementById($scope.FILE_KEYS[i]).files[0];
        console.log(file);
        if (file !== null && file !== undefined) {
          filesToSend +=1;
          var filePath = path  + $scope.FILE_KEYS[i];
          getSignedRequest(file, filePath, progressPerFile);
        }
      }
    }
  }

  function getSignedRequest(file, filePath, increment) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${filePath}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(file);
          changeCompleted(increment/2);
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url, increment/2);
        } else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  function uploadFile(file, signedRequest, url, progress) {
    if (!canceled) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            uploadedFiles += 1;
            changeCompleted(progress, true);
          } else {
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }
  }

  function changeCompleted(increment, endable) {
    $scope.completed += increment;
    $scope.$apply();
    console.log($scope.completed);
    if(uploadedFiles == filesToSend && endable) {
      $window.location.href = '/hotspots/';

    }
  }

  $scope.cancelUpload = function() {
    canceled = true;
  }

  $scope.getTemplate("image", true);
});
