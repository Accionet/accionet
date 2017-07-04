const fs = require('fs');
const utils = require('./utils');
const path = require('path');
const TemplateInformation = require('./TemplateInformation');

const compileString = function (string, values) {
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
    const search = new RegExp(inTextKey, 'g');
    string = string.replace(search, values[keys[i]]);
  }
  return string;
};

const compileFile = function (filePath, values) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(compileString(data, values));
    });
  });
};

exports.compileVisitCounter = function (hotspot_id) {
  const values = {
    HOST: utils.HOST,
    HOTSPOT_ID: hotspot_id,
  };
  return compileFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'javascripts', 'visitCounter.js'), values);
};


exports.compile = compileString;


exports.addJS = function (values, folderAbsolutePath) {
  values['VISIT-COUNTER'] = `${folderAbsolutePath}/counter.js`;
  values['ACTIVITY-CATCHER'] = `${folderAbsolutePath}/activityCatcher.js`;
  return values;
};

/* FIXME: this method assumes that its a survey with only 1 question. This could(or should) change*/
const extractQuestionIds = function (survey, template_id, values) {
  const compilingData = TemplateInformation.optionCompilingData[template_id];
  for (let i = 0; i < survey.questions[0].options.length; i++) {
    const option = survey.questions[0].options[i];
    for (let i = 0; i < compilingData.statement.length; i++) {
      const v = compilingData.statement[i];
      if (v === option.statement) {
        values[compilingData.keys[i]] = option.id;
      }
    }
  }
  values['QUESTION-ID'] = survey.questions[0].id;
  return values;
};

exports.compileActivityCatcher = function (folderPath, template_id, survey) {
  let values = {
    HOST: utils.HOST,
    'SURVEY-ID': survey.id,
  };
  values = extractQuestionIds(survey, template_id, values);
  return compileFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'javascripts', 'activityCatcher.js'), values);
};
