const Answer = require('../answer');
const Question = require('../questions');
const Option = require('../options');
const knex = require('../../db/knex');


class AnswerMetric {


  ofQuestion(id) {
    return new Promise((resolve, reject) => {
      Question.findById(id).then((question) => {
        switch (question.type) {
        case Answer.MULTIPLE_CHOICE:
          this.asMultipleChoice(question);
          break;
        default:
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

  // exports.getMetrics = function (question, callback) {
  //   switch (question.type) {
  //   case MULTIPLE_CHOICE:
  //     getMetricsOfMultipleChoice(question, callback);
  //     break;
  //   default:
  //   }
  // };
  //
  // function getMetricsOfMultipleChoice(question, callback) {
  //   const deferrer = q.defer();
  //   const metrics = {};
  //
  //   // Get a Postgres client from the connection pool
  //   pg.connect(connectionString, (err, client, done) => {
  //     // Handle connection errors
  //     if (err) {
  //       done();
  //       deferrer.reject(err);
  //     } else {
  //       const query = client.query('SELECT enumeration, statement, count(*) FROM answer, options WHERE answer.question_id = $1 AND options.question_id = $1 AND answer.answer_option_id = options.id GROUP BY enumeration, statement ORDER BY enumeration', [question.id]);
  //       query.on('row', (row) => {
  //         metrics[row.enumeration] = {
  //           statement: row.statement,
  //           count: row.count,
  //         };
  //       });
  //
  //       // After all data is returned, close connection and return results
  //       query.on('end', () => {
  //         done();
  //         question.metrics = metrics;
  //         deferrer.resolve(question);
  //       });
  //     }
  //   });
}
const instance = new AnswerMetric();
module.exports = instance;
