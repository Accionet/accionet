/* eslint-disable */
$(function() {
  var macAddress = $('#macAddress').val();
  console.log(navigator.userAgent.toLowerCase());
  var destination = 'download.html';
  var isApple = (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1);

  if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
    destination = $('#link-android').val();
  }
  if (isApple) {
    destination = $('#link-iphone').val();
  }
  if (navigator.userAgent.toLowerCase().indexOf("windows phone") > -1) {
    destination = $('#link-windows-phone').val();
  }

  var visit_done = false;
  var survey_done = false;
  var times_tried = 0;
  var max_times_to_try = 5;
  var visitJSON = {
    place_id: 2,
    macaddress: macAddress,
  }

  function previousConnection() {
    //Support previous conection
    $.post('http://streetpark.herokuapp.com/visit', {
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
      url: 'http://accionet.herokuapp.com/survey/3/response',
      success: function(data) {
        visit_done = true;
        redirect();
      },
      error: function(err) {
        visit_done = true;
        redirect();
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
      url: 'http://accionet.herokuapp.com/visits/new',
      data: JSON.stringify(visitJSON),
      success: function(data) {
        registerTimesTried(times_tried);
      },
      error: function(err, status, asdf) {
        if (times_tried == max_times_to_try) {
          // register the error
          registerTimesTried("Falló las " + max_times_to_try + " que intentó");

          //See if this works
          $.post('http://accionet.herokuapp.com/visits/new', {
            place_id: 2,
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

  function redirect() {
    if (visit_done && survey_done) {
      window.location = destination;
    }
  }

  function registerLinkPressed(id_pressed) {
    var json = {
      survey_id: 4,
      answers: [{
        question_id: 6,
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
  var $download_cabify = $('#download_cabify');

  $download_cabify.on('click', function(event) {
    event.preventDefault();
    registerLinkPressed(1);
  });

  $navigate.on('click', function(event) {
    event.preventDefault();
    destination = $(this).attr('href');
    registerLinkPressed(2);
  });

  sendVisit();

});
