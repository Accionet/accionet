const User = require('../users');
const Access = require('../access');

const knex = require('../../db/knex');


function accessibleBy(user_id, is_active) {
  if (!is_active) {
    is_active = false;
  }
  return new Promise((resolve, reject) => {
    User.isAdmin(user_id).then((isAdmin) => {
      if (isAdmin) {
        return resolve(this.find({
          is_active,
        }));
      }
      return resolve(this.filterWithAccess(user_id, is_active));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getWhereParamsForAccessible(user_id, table_name, is_active) {
  return {
    user_id,
    table_name,
    is_active,
  };
}

function getSelectParamsForAccessible(attributesNames) {
  for (let i = 0; i < attributesNames.length; i++) {
    attributesNames[i] = `${this.table_name}.${attributesNames[i]}`;
  }
  attributesNames.push('access_type');
  return attributesNames;
}

function filterWithAccess(user_id, is_active) {
  return new Promise((resolve, reject) => {
    const where = this.getWhereParamsForAccessible(user_id, this.table_name, is_active);
    this.getAttributesNames().then((attributesNames) => {
      const selectParams = this.getSelectParamsForAccessible(attributesNames);
      resolve(knex.select(selectParams)
        .from(this.table_name).innerJoin(Access.table_name, `${this.table_name}.id`, '=', `${Access.table_name}.access_id`)
        .where(where));
    }).catch((err) => {
      reject(err);
    });
  });
}


exports.decorate = function (prototype) {
  prototype.accessibleBy = accessibleBy;
  prototype.filterWithAccess = filterWithAccess;
  prototype.getWhereParamsForAccessible = getWhereParamsForAccessible;
  prototype.getSelectParamsForAccessible = getSelectParamsForAccessible;
};
