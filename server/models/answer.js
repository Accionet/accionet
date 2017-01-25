const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Answer extends Table {

  constructor() {
    const table_name = 'answer';
    super(table_name);
    this.setTypes();
  }

  setTypes() {
    this.MULTIPLE_CHOICE = 'multiple_choice';
    this.SHORT_TEXT = 'short_text';
    this.LONG_TEXT = 'long_text';
    this.MULTIPLE_ANSWER = 'multiple_answer';
  }
}

const instance = new Answer();

module.exports = instance;
