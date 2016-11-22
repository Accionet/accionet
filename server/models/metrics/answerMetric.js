const Answer = require('../answer');
const Question = require('../questions');
const knex = require('../../db/knex');


class AnswerMetric {


  ofQuestion(id) {
    return new Promise((resolve, reject) => {
      Question.findById(id).then((question) => {

      }).catch((err) => {
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
