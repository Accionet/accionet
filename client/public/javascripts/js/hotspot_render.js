/* public/script.js */
/* eslint-disable */
$(function () {

  var converter = new showdown.Converter();
  var pad = $('#pad');
  var text = $('#markdown');

  var convertTextAreaToMarkdown = function () {
    var markdownText = pad.val();
    var html = converter.makeHtml(markdownText);
    text.html(html);
  };

  pad.bind('input propertychange', function() {
    convertTextAreaToMarkdown();
  })
});
