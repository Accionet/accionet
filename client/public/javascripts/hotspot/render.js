/* public/script.js */
/* eslint-disable */
$(function() {

  var fileupload = $('.file-upload');

  function readURL(input, key) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        angular.element(input).scope().recompile(key, e.target.result, true);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  fileupload.on('change', function(event) {
    readURL(this, $(this).data('key'))
  });

});
