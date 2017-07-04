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
