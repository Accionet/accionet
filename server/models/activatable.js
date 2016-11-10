const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Activatable extends Table {


  toggleIsActive(id) {
    // get the current is active;
    return new Promise((resolve, reject) => {
      super.findById(id)
        .then((result) => {
          if (!result || !('is_active' in result)) {
            reject(`Hubo en error consiguiendo si ${id} está o no activo actualmente`);
          }
          super.update(id, {
            is_active: !result.is_active,
          }).then((entry) => {
            resolve(entry);
          })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Activatable;
