/* eslint-disable */
$(function() {

  var changeHotspotSize = $('.change_size');
  var rotateHotspot = $('.rotate')
  var current_view = 'mobile';
  var orientation = 'portrait';
  var $mobile = $('#mobile-border');
  var $tablet = $('#tablet-border');
  var $computer = $('#computer-border');

  var leftMargins = { "portrait": {
      "mobile": 37,
      "tablet": 153,
      "computer": 51,
  }}

  var topMargins = { "portrait": {
      "mobile": -789,
      "tablet": -710,
      "computer": -908,
  }}

  var rotateScreenBorder = function() {
    var $screenBorder = $('.screen-border');

    if (orientation === 'landscape') {
      var margin = ($screenBorder.width() / 2).toString() + "px";
      $screenBorder.rotate(-90);
      $screenBorder.css("margin-left", margin);
    } else {
      $screenBorder.rotate(0);
      $screenBorder.css("margin-left", "0px");
    }


  }

  var rotateOrientation = function() {
    if (orientation === 'portrait') {
      return orientation = 'landscape';
    }
    orientation = 'portrait';

  }

  rotateHotspot.on('click', function(event) {
    if ($(this).hasClass('text-muted')) {
      return;
    }
    var currentWidth = $('.screen').width() + "px";
    var currentHeight = $('.screen').height() + "px";
    rotateOrientation();
    rotateScreenBorder();
    setSize($('.screen'), currentHeight, currentWidth);
  })

  function disableRotator() {
    if (current_view === 'computer') {
      rotateHotspot.addClass('text-muted');
    } else {
      rotateHotspot.removeClass('text-muted');

    }
  }

  function setSize(elem, width, height) {
    elem.width(width);
    elem.height(height);
    elem.css({
      "max-height": height,
      "max-width": width
    });
  }

  var stretchLinear = function(length, anchor) {
    var multiplier = parseInt(length) / 375;
    return (multiplier * anchor).toString() + "px";
  }

  var stretchVertically = function(length, anchor) {
    var multiplier = parseInt(length) / 667;
    return (multiplier * anchor - borderHeightPort).toString() + "px";
  }

  var setScreenMargins = function(width, height) {
    $('.screen').css("margin-left", leftMargins[orientation][current_view]);
    $('.screen').css("margin-top", topMargins[orientation][current_view]);

  }

  var resizeScreen = function(width, height) {
    setSize($('.screen'), width.toString() + "px", height.toString() + "px");
    setScreenMargins(width, height);
  }

  var changeBorder = function() {
    $mobile.addClass('hidden');
    $tablet.addClass('hidden');
    $computer.addClass('hidden');
    if(current_view === 'mobile'){
      $mobile.removeClass('hidden');
    }
    if(current_view === 'tablet'){
      $tablet.removeClass('hidden');
    }
    if(current_view === 'computer'){
      $computer.removeClass('hidden');
    }
  }


  changeHotspotSize.on('click', function(event) {
    var width = $(this).data('width');
    var height = $(this).data('height');
    current_view = $(this).data('name');
    disableRotator();
    resizeScreen(width, height);
    changeBorder();
    // resizeBorder(width, height);
    // setSize($('.screen'), width.toString() + "px", height.toString() + "px");
    // var leftMargin = stretchLinear(width, screenLeftMarginPort);
    // $('.screen').css("margin-left", leftMargin);
    // var borderWidth = stretchLinear(width, borderWidthPort);
    // setSize($('#screen-border'),borderWidth, height);

  });

});
