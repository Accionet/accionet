/* public/script.js */
/* eslint-disable */
$(function() {

  var converter = new showdown.Converter();
  var text = $('#markdown');
  var image = $('.hotspot img');
  var fileupload = $('#image-upload');
  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';





  var convertToHtml = function convertToHtml() {
    $('#hotspot').remove();
    console.log('converting ');
    var text = $('#imageTemplate').val();
    console.log(text);
    var iframe = $('<iframe frameborder="0" name="hotspot" id="hotspot"> </iframe>');
    iframe.appendTo('#hotspotContainer');
    var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
    iframewindow.document.open();
    iframewindow.document.write(text);
    iframewindow.document.close();
  }

  convertToHtml();




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
