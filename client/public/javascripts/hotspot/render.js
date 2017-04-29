/* public/script.js */
/* eslint-disable */
$(function() {

  var converter = new showdown.Converter();
  var text = $('#markdown');
  var $imageTemplate = $('#imageTemplate');
  var fileupload = $('.file-upload');
  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';








  function readURL(input, key) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        angular.element(input).scope().recompile(key, e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  fileupload.on('change', function(event) {
    readURL(this, $(this).data('key'))
  });

});
