const knex = require('../../db/knex');


function getWhereParamsForAccessible(user_id, table_name, is_active) {
  return {
    user_id,
    table_name,
    is_active,
  };
}


function countAccessibleBy(user_id, is_active) {
  const User = require('../users'); // eslint-disable-line global-require

  if (!is_active) {
    is_active = false;
  }
  return new Promise((resolve, reject) => {
    User.isAdmin(user_id).then((isAdmin) => {
      if (isAdmin) {
        return resolve(this.count({
        }));
      }
      return resolve(this.countFilterWithAccess(user_id, is_active));
    }).catch((err) => {
      reject(err);
    });
  });
}

function countFilterWithAccess(user_id, is_active) {
  const Access = require('../access'); // eslint-disable-line global-require

  const where = this.getWhereParamsForAccessible(user_id, this.parent_table_name, is_active);

  return new Promise((resolve, reject) => {
    const singularParent = this.parent_table_name.substring(0, this.parent_table_name.length - 1);
    // console.log(knex.count().from(knex.raw('(' + knex.select(`${this.parent_table_name}.id`) // eslint-disable-line prefer-template
    //         .from(`${this.parent_table_name}`).innerJoin(Access.table_name, `${this.parent_table_name}.id`, '=', `${Access.table_name}.access_id`)
    //         .where(where) + ') as alias')).innerJoin(this.table_name, 'alias.id', '=', `${this.table_name}.${singularParent}_id`).toString());
    knex.count().from(knex.raw('(' + knex.select(`${this.parent_table_name}.id`) // eslint-disable-line prefer-template
        .from(`${this.parent_table_name}`).innerJoin(Access.table_name, `${this.parent_table_name}.id`, '=', `${Access.table_name}.access_id`)
        .where(where) + ') as alias')).innerJoin(this.table_name, 'alias.id', '=', `${this.table_name}.${singularParent}_id`)
      .then((result) => {
        resolve(result[0].count);
      })
      .catch((err) => {
        reject(err);
      });
  });
}


exports.decorate = function (prototype, parent) {
  prototype.parent_table_name = parent.table_name;

  // count
  prototype.countAccessibleBy = countAccessibleBy;
  prototype.countFilterWithAccess = countFilterWithAccess;
  prototype.getWhereParamsForAccessible = getWhereParamsForAccessible;
};
