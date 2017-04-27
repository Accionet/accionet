/* public/script.js */
/* eslint-disable */
$(function() {

  var converter = new showdown.Converter();
  var text = $('#markdown');
  var $imageTemplate = $('#imageTemplate');
  var fileupload = $('#image-upload');
  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';






  var convertToHtml = function convertToHtml() {
    $('#hotspot').remove();
    var text = $imageTemplate.val();
    var iframe = $('<iframe frameborder="0" name="hotspot" id="hotspot"> </iframe>');
    iframe.appendTo('#hotspotContainer');
    var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
    iframewindow.document.open();
    iframewindow.document.write(text);
    iframewindow.document.close();
  }

  convertToHtml();




  function changeImage(path) {
    var html = $imageTemplate.val();
    var startPoint = $imageTemplate.data('imageSrc');
    var startQuote = html.indexOf('"', startPoint);
    var endQuote = html.indexOf('"', startQuote + 1);
    var endHtml = html.substring(0, startQuote + 1) + path + html.substring(endQuote, html.length);
    $imageTemplate.text(endHtml);
    convertToHtml();
  }


  function readURL(input) {
    if (input.files && input.files[0]) {
      console.log('reaad IRL');
      var reader = new FileReader();

      reader.onload = function(e) {
        changeImage(e.target.result);
        // console.log(e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imgInp").change(function() {
    readURL(this);
  });

  fileupload.on('change', function(event) {
    readURL(this)
  });

});
