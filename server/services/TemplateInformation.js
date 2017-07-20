const path = require('path');

exports.IDS = ['LANDING-PAGE', 'SURVEY'];

exports.JSkeys = {
  'LANDING-PAGE': ['VISIT-COUNTER', 'ACTIVITY-CATCHER'],
};


exports.mediaKeys = {
  'LANDING-PAGE': ['IMAGE-PATH', 'BACKGROUND-IMAGE'],
};

exports.activityCatcher = {
  'LANDING-PAGE': [{
    title: 'Botón apretado',
    number: 1,
    type: 'multiple_choice',
    options: [{
      statement: 'Botón principal',
      enumeration: 'A',
    }, {
      statement: 'Solo quiero navegar',
      enumeration: 'B',
    }],
  }],
};

exports.optionCompilingData = {
  'LANDING-PAGE': {
    statement: ['Botón principal', 'Solo quiero navegar'],
    keys: ['CONNECT', 'SURF-ONLY'],
  },
};


exports.templateFilePath = {
  'LANDING-PAGE': path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'landing-page', 'template.html'),
  GIF: path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'landing-page', 'template.html'),
  IMAGE: path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'landing-page', 'template.html'),

};


exports.valuesPath = {
  'LANDING-PAGE': path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'landing-page', 'defaultValues.json'),
  GIF: path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'gif', 'defaultValues.json'),
  IMAGE: path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'defaultValues.json'),

};
