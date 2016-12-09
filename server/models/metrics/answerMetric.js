const Answer = require('../answer');
const Question = require('../questions');
const Option = require('../options');


class AnswerMetric {


  ofQuestion(id) {
    return new Promise((resolve, reject) => {
      Question.findById(id).then((question) => {
        switch (question.type) {
        case Answer.MULTIPLE_CHOICE:
          resolve(this.asMultipleChoice(question));
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

  multipleChoiceSearchParams(question_id) {
    const searchParams = {};
    searchParams[`${Answer.toString()}.question_id`] = question_id;
    searchParams[`${Option.toString()}.question_id`] = question_id;
    // searchParams[`${Option.toString()}.id`] = `${Answer.toString()}.answer_option_id`;
    return searchParams;
  }

  adaptMultipleChoice(response) {
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
        return reject(`Invalid type: ${question.type} is not a multiple_choice`);
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

  asMultipleChoice(question) {
    return new Promise((resolve, reject) => {
      if (question.type !== Answer.MULTIPLE_CHOICE) {
        return reject(`Invalid type: ${question.type} is not a multiple_choice`);
      }
      const searchParams = this.multipleChoiceSearchParams(question.id);
      Answer.table()
        .join(Option.toString(), `${Option.toString()}.id`, '=', `${Answer.toString()}.answer_option_id`)
        .where(searchParams)
        .select('enumeration', 'statement')
        .count('*')
        .groupByRaw('enumeration, statement')
        .orderBy('enumeration')
        .then((response) => {
          const metrics = this.adaptMultipleChoice(response);
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
