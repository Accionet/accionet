// server/models/options.js
'use strict';


const base = require('../models/base');

const table_name = 'options';


// Return all the entries active or not
exports.all = function (callback) {
  base.all(table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function (callback) {
  base.new(table_name, callback);
};

// Creates a json with the attr in attr

function save(attr, callback) {
  base.save(attr, table_name, callback);
}

exports.save = save;


function update(id, attr, callback) {
  base.update(id, attr, table_name, callback);
}

exports.update = update;


exports.updateOptionsOfQuestion = function (question, callback) {
  const attr = {
    question_id: question.id,
  };

  const newOptions = question.options;

  base.find(attr, table_name, (err, options) => {
    if (err) {
      return callback(err);
    }

    const optionsToCreate = [];
    const optionsToDelete = [];
    const optionsToUpdate = [];
        // Delete and update the ones that actually exists
    for (let i = 0; i < options.length; i++) {
      let survives = false;
      for (let j = 0; j < newOptions.length; j++) {
        if (options[i].id === newOptions[j].id) {
          survives = true;
          optionsToUpdate.push(newOptions[j]);
          break;
        }
      }

      if (!survives) {
        optionsToDelete.push(options[i]);
      }
    }

    for (let j = 0; j < newOptions.length; j++) {
      let create = true;
      for (let i = 0; i < options.length; i++) {
        if (options[i].id === newOptions[j].id) {
          create = false;
          break;
        }
      }
      if (create) {
        optionsToCreate.push(newOptions[j]);
      }
    }
    let finishedQueries = 0;

    const totalQueries = optionsToCreate.length + optionsToDelete.length + optionsToUpdate.length;

    for (let i = 0; i < optionsToDelete.length; i++) {
      const option = optionsToDelete[i];
      base.delete(option.id, table_name, (err) => {
        finishedQueries++;
        if (err) {
          return callback(err);
        }
        if (finishedQueries === totalQueries) {
          return callback(null, newOptions);
        }
      });
    }

    for (let i = 0; i < optionsToUpdate.length; i++) {
      const option = optionsToUpdate[i];
      update(option.id, option, (err) => {
        finishedQueries++;
        if (err) {
          return callback(err);
        }
        if (finishedQueries === totalQueries) {
          return callback(null, newOptions);
        }
      });
    }

    for (let i = 0; i < optionsToCreate.length; i++) {
      const option = optionsToCreate[i];
      option.question_id = question.id;
      save(option, (err) => {
        finishedQueries++;
        if (err) {
          return callback(err);
        }
        if (finishedQueries === totalQueries) {
          return callback(null, newOptions);
        }
      });
    }
  });
};

exports.findById = function (id, callback) {
  base.findById(id, table_name, callback);
};

exports.findOne = function (id, attr, callback) {
  base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function (callback) {
  base.columnNames(table_name, callback);
};
