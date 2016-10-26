module.exports = {
  // surveys of user accionet
  accionet: [{
    title: 'Rango Etario Streetpark',
    is_active: true,
    questions: [{
      title: '¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta',
      type: 'multiple_choice',
      number: 1,
    }, {
      title: 'Eres hombre?',
      type: 'multiple_choice',
      number: 2,
    }, {
      title: 'Que numero te gusta mas?',
      type: 'multiple_choice',
      number: 3,
    }],
  }, { // Survey Encuesta 1
    title: 'Encuesta 1',
    is_active: true,
    questions: [],
  }, {
    title: 'Encuesta 2',
    is_active: true,
  }],
};
