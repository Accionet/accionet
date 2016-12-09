const Response = require('../models/responses');
const httpResponse = require('../services/httpResponse');


exports.count = function (req, res) {
  Response.count().then((data) => {
    const json = httpResponse.success('Visitas totales', 'amount', data);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};
