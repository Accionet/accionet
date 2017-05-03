/* eslint-disable */
services

  .service('Utils', function() {

    this.parseJson = function (string) {
      string = jsonEscape(string);
      return JSON.parse(string);

    }

    function jsonEscape(str)  {
      // str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');

        return str.replace(/\n/g, "\\\\n ").replace(/\r/g, "\\\\r ").replace(/\t/g, "\\\\t ");
    }
});
