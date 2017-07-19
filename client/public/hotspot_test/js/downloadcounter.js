/* eslint-disable*/
$(function(){

  var destination = '$(link-login-only)?dst=https://cabify.com/chile/santiago&amp;username=T-$(mac-esc)';

  function redirect() {
    if (survey_done) {
      window.location = destination;
    }
  }

  function registerLinkPressed(id_pressed, button_pressed) {
    destination = $(button_pressed).attr('href');

    var json = {
      survey_id: 4,
      answers: [{
        question_id: 6,
        answer_option_id: id_pressed
      }]
    };
    var json_send = JSON.stringify(json);
    $.ajax({
      type: 'POST',
      dataType: "json",
      data: {
        string_json: json_send
      },
      url: ('http://accionet.herokuapp.com/survey/4/response'),
      success: function() {
        survey_done = true;
        redirect();
      },
      error: function(err) {
        survey_done = true;
        redirect();
      }
    });
  }

  var $navigate = $('#navigate');
  var $iphone = $('#iphone');
  var $android = $('#android');
  var $windows = $('#windows');



  $navigate.on('click', function(event) {
    event.preventDefault();
    registerLinkPressed(3, this);
  });

  $iphone.on('click', function(event) {
    event.preventDefault();
    registerLinkPressed(4, this);
  });

  $android.on('click', function(event) {
    event.preventDefault();
    registerLinkPressed(6, this);
  });

  $windows.on('click', function(event) {
    event.preventDefault();
    registerLinkPressed(5, this);
  });


})
