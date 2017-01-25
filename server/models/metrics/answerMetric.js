const Answer = require('../answer');
const Question = require('../questions');
const Option = require('../options');


class AnswerMetric {


  ofQuestion(id) {
    return new Promise((resolve, reject) => {
      Question.findById(id).then((question) => {
        switch (question.type) {
        case Answer.MULTIPLE_CHOICE:
          resolve(this.asMultipleOptions(question));
          break;
        case Answer.MULTIPLE_ANSWER:
          resolve(this.asMultipleOptions(question));
          break;
        case Answer.SHORT_TEXT:
          resolve(this.asText(question));
          break;
        default:
          resolve();
          break;
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  isMultipleOption(question) {
    return question.type === Answer.MULTIPLE_CHOICE || question.type === Answer.MULTIPLE_ANSWER;
  }

  multipleOptionsSearchParams(question_id) {
    const searchParams = {};
    searchParams[`${Answer.toString()}.question_id`] = question_id;
    searchParams[`${Option.toString()}.question_id`] = question_id;
    // searchParams[`${Option.toString()}.id`] = `${Answer.toString()}.answer_option_id`;
    return searchParams;
  }

  adaptMultipleOptions(response) {
    const metrics = {};
    for (let i = 0; i < response.length; i++) {
      const row = response[i];
      metrics[row.enumeration] = {
        statement: row.statement,
        count: row.count,
      };
    }
    return metrics;
  }

  asText(question) {
    return new Promise((resolve, reject) => {
      if (!(question.type === Answer.SHORT_TEXT || question.type === Answer.LONG_TEXT)) {
        return reject(`Invalid type: ${question.type} is not a text answer`);
      }
      Answer.table().count('* as amount')
      .select('answer_text').where({
        question_id: question.id,
      })
      .groupBy('answer_text')
      .orderBy('amount', 'desc')
      .limit(20)
        .then((answers) => {
          resolve(answers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  asMultipleOptions(question) {
    return new Promise((resolve, reject) => {
      if (!this.isMultipleOption(question)) {
        return reject(`Invalid type: ${question.type} is not a multiple option`);
      }
      const searchParams = this.multipleOptionsSearchParams(question.id);
      Answer.table()
        .join(Option.toString(), `${Option.toString()}.id`, '=', `${Answer.toString()}.answer_option_id`)
        .where(searchParams)
        .select('enumeration', 'statement')
        .count('*')
        .groupByRaw('enumeration, statement')
        .orderBy('enumeration')
        .then((response) => {
          const metrics = this.adaptMultipleOptions(response);
          resolve(metrics);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  asMultipleAnswer(question) {
    return new Promise((resolve, reject) => {
      if (!this.isMultipleOption(question)) {
        return reject(`Invalid type: ${question.type} is not a multiple option`);
      }
      const searchParams = this.multipleOptionsSearchParams(question.id);
      Answer.table()
        .join(Option.toString(), `${Option.toString()}.id`, '=', `${Answer.toString()}.answer_option_id`)
        .where(searchParams)
        .select('enumeration', 'statement')
        .count('*')
        .groupByRaw('enumeration, statement')
        .orderBy('enumeration')
        .then((response) => {
          const metrics = this.adaptMultipleOptions(response);
          resolve(metrics);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const instance = new AnswerMetric();
module.exports = instance;
