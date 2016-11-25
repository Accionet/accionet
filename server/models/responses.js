const table = require('./table');
const utils = require('../services/utils');
const EndUserDecorator = require('./decorators/CountEndUsers');
const DayMetricsDecorator = require('./decorators/DayMetrics');
const HourMetricsDecorator = require('./decorators/HourMetrics');
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
    /*
    SELECT r.id as contestacion, r.created_at as "ingresada", r.updated_at as "ultima actualizacion", r.macaddress, q.number as "N. de la pregunta", q.title as "pregunta", o.statement as "respuesta"
    FROM response as r, questions as q, options as o, answer as a
    WHERE  q.survey_id = r.survey_id  AND o.question_id = q.id  AND q.type = 'multiple_choice'
        AND a.response_id = r.id  AND a.answer_option_id = o.id  AND  r.survey_id = 2386
    ORDER BY q.number, o.enumeration, "ingresada"
    */

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
        `${option}.statement as respuesta`)
      .from(knex.raw(`${response}, ${question}, ${option}, ${answer}`))
      .where(knex.raw(`${response}.survey_id = ${attr.survey_id}`))
      .andWhere(knex.raw(`${question}.survey_id = ${response}.survey_id`))
      .andWhere(knex.raw(`${option}.question_id = ${question}.id`))
      .andWhere(knex.raw(`${question}.type = 'multiple_choice'`))
      .andWhere(knex.raw(`${answer}.response_id = ${response}.id`))
      .andWhere(knex.raw(`${answer}.answer_option_id = ${option}.id`))
      .orderByRaw(`${question}.number, ${option}.enumeration, "ingresada"`);
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


module.exports = instance;
