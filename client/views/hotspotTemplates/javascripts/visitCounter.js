/* eslint-disable */
$(function() {
  var macAddress = $('#macAddress').val();

  var visit_done = false;
  var times_tried = 0;
  var max_times_to_try = 5;
  var visitJSON = {
    hotspot_id: $HOTSPOT_ID$,
    place_id: $PLACE_ID$,
    macaddress: macAddress,
  }

  function previousConnection() {
    //Support previous conection
    $.post('$HOST$/visit', {
      macaddress: macAddress,
    });
  }

  function registerTimesTried(times) {
    var success_json = {
      survey_id: 3,
      answers: [{
        question_id: 7,
        answer_text: times,
      }],
      macaddress: macAddress,
    };
    var success_send = JSON.stringify(success_json);

    $.ajax({
      type: 'POST',
      data: {
        string_json: success_send,
      },
      url: '$HOST$/survey/3/response',
      success: function(data) {
        visit_done = true;
      },
      error: function(err) {
        visit_done = true;
      },
      dataType: 'json',
    });
  }

  function sendVisit() {
    times_tried = times_tried + 1;
    if (times_tried == 1) {
      previousConnection();
    }
    $.ajax({
      type: 'POST',
      url: '$HOST$/visits/new',
      data: JSON.stringify(visitJSON),
      success: function(data) {
        registerTimesTried(times_tried);
      },
      error: function(err, status, asdf) {
        if (times_tried == max_times_to_try) {
          // register the error
          registerTimesTried("Falló las " + max_times_to_try + " que intentó");

          //See if this works
          $.post('$HOST$/visits/new', {
            hotspot_id: $HOTSPOT_ID$,
            place_id: $PLACE_ID$,
            macaddress: macAddress,
          });
        } else if (times_tried < max_times_to_try) {
          sendVisit();
        }
      },
      contentType: "application/json",
      dataType: 'json'
    });
  }

  sendVisit();

});
