/* eslint-disable */
services

  .service('Utils', function() {

    this.parseJson = function (string) {
      string = jsonEscape(string);
      return JSON.parse(string);

    }

    function jsonEscape(str)  {
        var s = str.split('"');
        var res = s[0]
        for (var i = 1; i < s.length; i ++){
          if(!Number.isInteger(i/2)){
            s[i] = s[i].replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
          }
          res += '"' + s[i]
        }
        return res
    }
});
