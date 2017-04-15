//
const Users = require('../models/users');
const Access = require('../models/access');
const httpResponse = require('../services/httpResponse');


exports.fromUser = function (req, res) {
  const user_id = req.params.id;
  console.log(user_id);
  Access.find({ user_id }).then((results) => {
    const json = httpResponse.success('Ok', 'data', results);
    return res.status(200).send(json);
  }).catch((err) => {
    return res.status(500).send({
      error: err,
    });
  });
};
