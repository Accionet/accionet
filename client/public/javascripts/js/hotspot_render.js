/* public/script.js */
/* eslint-disable */
$(function() {

  var converter = new showdown.Converter();
  var pad = $('#pad');
  var text = $('#markdown');
  var image = $('.hotspot img');
  var fileupload = $('#image-upload');
  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';

  var convertTextAreaToMarkdown = function() {
    var markdownText = pad.val();
    var html = converter.makeHtml(markdownText);
    text.html(html);
  };

  pad.bind('input propertychange', function() {
    convertTextAreaToMarkdown();
  })


  rotateHotspot.on('click', function (event) {

  })

function disableRotator() {
  if(current_view === 'computer'){
    rotateHotspot.addClass('text-muted');
  } else {
    rotateHotspot.removeClass('text-muted');

  }
}



  changeHotspotSize.on('click', function(event) {
    var width = $(this).data('width') + "px";
    var height = $(this).data('height') + "px";
    current_view = $(this).data('name');
    disableRotator();

    $('.screen').width(width);
    $('.screen').height(height);
    $('.screen').css({
        "max-height": height,
        "max-width": width
 });

  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      console.log('ENTRO');
      var reader = new FileReader();

      reader.onload = function(e) {
        image.attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imgInp").change(function() {
    readURL(this);
  });

  fileupload.on('change', function(event) {
    readURL(this)
      // console.log(fileupload.val());
      // image.attr('src', fileupload.val());
  });

});
