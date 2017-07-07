/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, Utils, placeService) {

  $scope.i = 1; // current_step
  $scope.selectedHotspot;
  $scope.places;
  $scope.loadingPlaces = true;
  $scope.loadPlacesFailed = false;


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
    $(function() {
      var f = document.getElementById('image-file').files[0];
    });
    var values = parseValuesToSend();
    $scope.selectedHotspot.template = "LANDING-PAGE";
    $http.post('/hotspots/save/', {
        template_id: "LANDING-PAGE",
        hotspotInfo: $scope.selectedHotspot,
        template: $scope.current_hotspot.template,
        values: values,
      })
      .success(function(data) {
        var files = document.getElementById('image-file').files;
        var file = files[0];
        if (file == null) {
          return alert('No file selected.');
        }
        var path = data.imageFolder + 'IMAGE-PATH';
        getSignedRequest(file, path);
      })
      .error(function(error) {
        console.log(error);
      });

  }

  function getSignedRequest(file, path) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${path}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
        } else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // notify all good
        } else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }



  $scope.getTemplate("image", true);
});
