/* public/script.js */
/* eslint-disable */
$(function () {

  var converter = new showdown.Converter();
  var pad = $('#pad');
  var text = $('#markdown');
  var image = $('.hotspot img');
  var fileupload = $('#image-upload');

  var convertTextAreaToMarkdown = function () {
    var markdownText = pad.val();
    var html = converter.makeHtml(markdownText);
    text.html(html);
  };

  pad.bind('input propertychange', function() {
    convertTextAreaToMarkdown();
  })


  function readURL(input) {
      if (input.files && input.files[0]) {
        console.log('ENTRO');
          var reader = new FileReader();

          reader.onload = function (e) {
              image.attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]);
      }
  }

  $("#imgInp").change(function(){
      readURL(this);
  });

  fileupload.on('change', function (event) {
    readURL(this)
    // console.log(fileupload.val());
    // image.attr('src', fileupload.val());
  });

});
