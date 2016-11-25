const table = require('./table');
const utils = require('../services/utils');
const EndUserDecorator = require('./decorators/CountEndUsers');
const DayMetricsDecorator = require('./decorators/DayMetrics');
const HourMetricsDecorator = require('./decorators/HourMetrics');

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
}

const instance = new Response();

// decorate
EndUserDecorator.addCountEndUsers(instance);
DayMetricsDecorator.addDayMetrics(instance);
HourMetricsDecorator.addHourMetrics(instance);


module.exports = instance;
