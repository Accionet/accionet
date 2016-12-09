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

  const survey_id = 23;

  $sendSurvey.on('click', function(event) {
    event.preventDefault();
    const json = {
      survey_id,
      answers: [{
        question_id: 43,
        answer_option_id: $('input[name=multiple_choice]:checked').val(),
      }, {
        question_id: 44,
        answer_text: $('input[name=text_answer]').val(),
      }],
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
