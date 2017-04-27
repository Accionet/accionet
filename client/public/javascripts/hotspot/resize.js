/* eslint-disable */
$(function() {

  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';


  rotateHotspot.on('click', function(event) {
    if ($(this).hasClass('text-muted')) {
      return;
    }
    var currentWidth = $('.screen').width() + "px";
    var currentHeight = $('.screen').height() + "px";
    setScreenSize(currentHeight, currentWidth);
  })

  function disableRotator() {
    if (current_view === 'computer') {
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

});
