/* eslint-disable */

controllers

  .controller('newHotspotController', function($scope, $http) {
  $scope.IMAGE_TEMPLATE = {
    template: "",
    defaultValues: "",
    compiledHTML: "",
  };

  $scope.current_hotspot = "";


  // getTemplate
  $scope.getTemplate = function(template, makeCurrent) {
    $http.get('/hotspots/template/' + template)
      .success(function(data) {
        $scope.IMAGE_TEMPLATE.template = data.htmlData;
        $scope.IMAGE_TEMPLATE.values = JSON.parse(data.defaultValues);
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
      var inTextKey = "$" + keys[i] + "$";
      temp = temp.replace(inTextKey, fileToCompile.values[keys[i]]);
    }
    fileToCompile.compiledHTML = temp;
    if (makeCurrent) {
      $scope.current_hotspot = fileToCompile.compiledHTML;
      $scope.renderHotspot();
    }
  };

   $scope.renderHotspot = function () {
     var text = $scope.current_hotspot;
     console.log(text);
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



  $scope.getTemplate("image", true);
});
