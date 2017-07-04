/* eslint-disable */
$(function() {
  var macAddress = $('#macAddress').val();
  function registerLinkPressed(id_pressed) {
    var json = {
      survey_id: $SURVEY-ID$,
      answers: [{
        question_id: $QUESTION-ID$,
        answer_option_id: id_pressed
      }],
      macaddress: macAddress
    };
    var json_send = JSON.stringify(json);
    $.ajax({
      type: 'POST',
      dataType: "json",
      data: {
        string_json: json_send
      },
      url: ('$HOST$survey/$SURVEY-ID$/response'),
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

  $('#connect').on('click', function(event) {
    event.preventDefault();
    registerLinkPressed($CONNECT$);
  });

  $('#surf-only').on('click', function(event) {
    event.preventDefault();
    destination = $(this).attr('href');
    registerLinkPressed($SURF-ONLY$);
  });

  sendVisit();

});
