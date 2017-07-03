/* eslint-disable */
'use strict';
// process.env.NODE_ENV = 'test';


// const Place = require('../models/places');
// const Answer = require('../models/answer');
// const User = require('../models/users');
// const Access = require('../models/access');
//
//
// const Survey = require('../models/surveys');
//
// const AnswerMetric = require('../models/metrics/answerMetric');
// const knex = require('../db/knex');
// const utils = require('../services/utils');
// const cmd = require('node-cmd');
//
// const Visit = require('../models/visits');
//
// const hotspotCotroller = require('../controllers/hotspotController');


const d = new Date();



// // var string = '"jo\njo"this no'
// var strings = []
// strings.push('{ "key": "object a"}')
//
// // s = string.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
// for (var i = 0; i < strings.length; i++) {
//   console.log(strings[i].replace("","_"));
// }

// let s = `{\n   "FONT-FAMILY": "'Nunito', sans-serif",\n   "BACKGROUND-COLOR": "white",\n   "BACKGROUND-IMAGE": "/images/login.jpg",\n   "IMAGE-PATH": "/images/antenasola.png",\n   "BUTTON-COLOR": "#FFF",\n   "BUTTON-BACKGROUND-COLOR": "#4bc970",\n   "BUTTON-BORDER-COLOR": "#3ac162",\n   "IMAGE-WIDTH": "25%",\n   "TERMS-AND-COND-COLOR": "#00F",\n   "TERMS-AND-COND-VISITED-COLOR": "#551a8b",\n   "FORM-BACKGROUND-COLOR": "#f4f7f8",\n   "TEXT-COLOR": "#384047",\n   "TITLE-SIZE": "2em",\n   "PARAGRAPH-SIZE": "1em",\n   "TITLE-TEXT": "Accionet",\n   "PARAGRAPH-1-TEXT":"Accionet es una empresa dedicada a activar redes de wifi gratuitas.",\n   "PARAGRAPH-2-TEXT":"Luego de apretar navegar podr&aacute;s navegar por 1 hora.",\n   "BUTTON-TEXT": "NAVEGAR",\n   "BUTTON-TEXT-SIZE": "1.4em",\n \n   "LANDING-PAGE": "https://www.accionet.cl"\n }\n`;
// ss = s.split= '"';
var str = `{\n  "FONT-FAMILY": "'Nunito', sans-serif","PARAGRAPH-1-TEXT":"Accionet es una empresa dedicada \n a activar redes de wifi gratuitas."\n }\n`;
var s = str.split('"');
var res = s[0]
for (var i = 1; i < s.length; i ++){
  if(!Number.isInteger(i/2)){
    s[i] = s[i].replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
  }
  res += '"' + s[i]
}
console.log(res);
console.log(JSON.parse(res));
