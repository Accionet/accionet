const table = require('./table');
const utils = require('../services/utils');
const EndUserDecorator = require('./decorators/CountEndUsers');
const DayMetricsDecorator = require('./decorators/DayMetrics');
const HourMetricsDecorator = require('./decorators/HourMetrics');
const AccessibleParent = require('./decorators/AccessibleParent');

const Option = require('./options');
const Question = require('./questions');
const Answer = require('./answer');
const knex = require('../db/knex');

class Response extends table {

  constructor() {
    const table_name = 'response';
    super(table_name);
  }

  saveAnswers(answers, response) {
    const Answer = require('./answer'); // eslint-disable-line global-require

    return new Promise((resolve, reject) => {
      const promises = [];
      for (let i = 0; i < answers.length; i++) {
        answers[i].response_id = response.id;
        promises.push(Answer.save(answers[i]));
      }
      const saveAnswer = Promise.all(promises);
      saveAnswer.then(() => {
        resolve(this.findById(response.id));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  save(attr) {
    const response = utils.cloneObject(attr);
    return new Promise((resolve, reject) => {
      const answers = response.answers;
      // if it has valid answers it shoul be an array
      if (answers && !(answers instanceof Array)) {
        reject('Answers should be an array');
      }
      // delete response answers so it does not complain that it has attributes it shoulnt
      delete response.answers;

      super.save(response).then((response) => {
        if (answers && answers.length > 0) {
          resolve(this.saveAnswers(answers, response, attr));
        } else {
          resolve(response);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseToSend(response) {
    const Answer = require('./answer'); // eslint-disable-line

    return new Promise((resolve, reject) => {
      Answer.find({
        response_id: response.id,
      }).then((answers) => {
        response.answers = answers;
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  findOfSurvey(survey_id) {
    return super.find({
      survey_id,
    });
  }


  queryForExcel(attr) {
    const response = this.toString();
    const question = Question.toString();
    const option = Option.toString();
    const answer = Answer.toString();

    return knex.select(`${response}.id as contestacion`,
        `${response}.created_at as ingresada`,
        `${response}.updated_at as ultima actualizacion`,
        `${response}.macaddress`,
        `${question}.number as N. de la pregunta`,
        `${question}.title as pregunta`,
        `${option}.statement as alternativa`,
        `${answer}.answer_text as texto`)
      .from(knex.raw(`${response}, ${question}, ${option}, ${answer}`))
      .where(knex.raw(`${response}.survey_id = ${attr.survey_id}`))
      .andWhere(knex.raw(`${question}.survey_id = ${response}.survey_id`))
      .andWhere(knex.raw(`${answer}.response_id = ${response}.id`))
      .andWhere(knex.raw(`${answer}.answer_option_id IS NOT NULL`))
      .andWhere(knex.raw(`${option}.question_id = ${question}.id`))
      .andWhere(knex.raw(`${answer}.answer_option_id = ${option}.id`))
      .union((subquery) => {
        subquery.select(`${response}.id as contestacion`,
            `${response}.created_at as ingresada`,
            `${response}.updated_at as ultima actualizacion`,
            `${response}.macaddress`,
            `${question}.number as N. de la pregunta`,
            `${question}.title as pregunta`,
            knex.raw('NULL as alternativa'),
            `${answer}.answer_text as texto`)
          .from(knex.raw(`${response}, ${question}, ${answer}`))
          .where(knex.raw(`${response}.survey_id = ${attr.survey_id}`))
          .andWhere(knex.raw(`${question}.survey_id = ${response}.survey_id`))
          .andWhere(knex.raw(`${answer}.response_id = ${response}.id`))
          .andWhere(knex.raw(`${answer}.answer_option_id IS NULL`))
          .andWhere(knex.raw(`${answer}.question_id = ${question}.id`));
      })
      .orderByRaw('"N. de la pregunta", "ingresada"');
  }


  dataForExcel(attr) {
    return this.queryForExcel(attr);
  }
}

const instance = new Response();

// decorate
EndUserDecorator.addCountEndUsers(instance);
DayMetricsDecorator.addDayMetrics(instance);
HourMetricsDecorator.addHourMetrics(instance);

AccessibleParent.decorate(instance, require('./surveys'));

module.exports = instance;
