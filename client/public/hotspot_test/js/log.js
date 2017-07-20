/* eslint-disable */
$(function() {
  function yourCustomLog(msg) {
     $("#response").text( $("#response").text() + "/ " + msg + " /");

  }
  window.console.log = yourCustomLog;
  window.console.error = yourCustomLog;
});
