/* eslint-disable*/
$(function() {
  const url = 'http://localhost:3000/';

  const macaddress = $('#macAddress').val();
  $.post(url + 'visits/new', {
    macaddress,
    place_id: 18,
  });


  const destination = '/makeLogin.html';


  const $sendSurvey = $('#sendSurvey');

  const survey_id = 54;

  $sendSurvey.on('click', function(event) {
    event.preventDefault();
    answers = [];
    $answers = $('input[name=multiple_answer]:checked');
    for (var i = 0; i < $answers.length; i++) {
      var a = {
            question_id: 76,
            answer_option_id: $($answers[i]).val(),
      }
      answers.push(a);
    }
    const json = {
      survey_id,
      answers,
      macaddress,
    };
    const json_send = JSON.stringify(json);
    console.log('mandar encuesta');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {
        string_json: json_send,
      },
      url: (url + `survey/${survey_id}/response`),
      success() {
        console.log('success');
        // window.location = destination;
      },
      error(err) {
        console.log('error');
        console.log(err);
      },
    });
  });
});
