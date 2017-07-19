/*eslint-disable*/

  $("input").change(function() {

    if ($("#terms_and_conditions").is(':checked')) {
      $('.boton').css({
        'opacity': '0.9',
        'pointer-events': 'auto',
        'cursor': 'pointer'
      });
    } else {
      $('.boton').css({
        'opacity': '0.5',
        'pointer-events': 'none',
        'cursor': 'default'
      });
    }
  });
