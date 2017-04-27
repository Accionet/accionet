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

  var convertTextAreaToMarkdown = function() {
    var markdownText = pad.val();
    var html = converter.makeHtml(markdownText);
    text.html(html);
  };



  var convertToHtml = function convertToHtml(){
    $('#hotspot').remove();
    console.log('converting ');
    var text = $('#imageTemplate').val();
    var iframe = $('<iframe frameborder="0" name="hotspot" id="hotspot"> </iframe>');
    iframe.appendTo('#iframewrapper');
    var iframewindow= iframe[0].contentWindow? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
        iframewindow.document.open();
        iframewindow.document.write(text);
        iframewindow.document.close();
  }


  rotateHotspot.on('click', function (event) {
    if($(this).hasClass('text-muted')){
      return;
    }
    var currentWidth = $('.screen').width() + "px";
    var currentHeight = $('.screen').height() + "px";
    setScreenSize(currentHeight, currentWidth);
  })

function disableRotator() {
  if(current_view === 'computer'){
    rotateHotspot.addClass('text-muted');
  } else {
    rotateHotspot.removeClass('text-muted');

  }
}

function setScreenSize(width, height) {
  $('.screen').width(width);
  $('.screen').height(height);
  $('.screen').css({
      "max-height": height,
      "max-width": width
    });
}


  changeHotspotSize.on('click', function(event) {
    var width = $(this).data('width') + "px";
    var height = $(this).data('height') + "px";
    current_view = $(this).data('name');
    disableRotator();
    setScreenSize(width, height);

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
