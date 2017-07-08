const fs = require('fs');
const path = require('path');
const Hotspot = require('../models/hotspot');
const Survey = require('../models/surveys');

const Requestify = require('requestify');
const Template = require('../services/Template');
const TemplateInformation = require('../services/TemplateInformation');
const S3connection = require('../services/S3connection');


const S3_BUCKET = process.env.S3_BUCKET;

/* Shows the view to create a new hotspot */
exports.new = function getNewPlace(req, res) {
  Hotspot.new().then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'hotspots', 'create.ejs'), {
      hotspot: result,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'hotspots', 'create.ejs'), {
      error: `ERROR: ${err}`,
      hotspot: [],
    });
  });
};


exports.getHotspot = function (req, res) {
  fs.readFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'template.html'), 'utf8', (err, data) => {
    fs.readFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'defaultValues.json'), 'utf8', (errJson, json) => {
      if (err || errJson) {
        const response = {
          error: err || errJson,
        };
        return res.status(500).send(response);
      }
      const response = {
        htmlData: data,
        defaultValues: json,
      };
      return res.status(200).send(response);
    });
  });
};


const changeImageValue = function (values, key, path) {
  values[key] = `${path}${key}`;
  return values;
};

const changeImages = function (template_id, values, path) {
  for (let i = 0; i < TemplateInformation.mediaKeys[template_id].length; i++) {
    const key = TemplateInformation.mediaKeys[template_id][i];
    values = changeImageValue(values, key, path);
  }
  return values;
};

const compile = function (template_id, template, values, folder) {
  const path = `${folder}/images/`;
  values = changeImages(template_id, values, path);
  values = Template.addJS(values, folder);
  template = Template.compile(template, values);
  return template;
};


exports.save = function (req, res) {
  const folderPath = `hotspots/${(new Date()).getTime()}`;
  const basePath = `https://s3.amazonaws.com/${S3_BUCKET}/`;
  const filePath = `${folderPath}/login.html`;
  const absolutePath = basePath + filePath;
  const template_id = req.body.hotspotInfo.template;
  saveToDB(req.body.hotspotInfo, absolutePath).then((hotspot) => {
    saveCounter(folderPath, hotspot).then(() => {
      saveActivityCatcher(folderPath, template_id, hotspot).then(() => {
        return uploadHTML(folderPath, basePath, req, res);
      }).catch((err) => {
        res.status(500).send(err);
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
};

const uploadHTML = function (folderPath, basePath, req, res) {
  const absolutePath = basePath + folderPath;
  const template_id = req.body.hotspotInfo.template;
  const fileBody = compile(template_id, req.body.template, req.body.values, absolutePath);
  const filePath = `${folderPath}/login.html`;
  S3connection.uploadFile(filePath, fileBody, true).then(() => {
    res.status(200).send({
      imageFolder: `${folderPath}/images/`,
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
};

const saveCounter = function (folderPath, hotspot) {
  const path = `${folderPath}/counter.js`;
  return new Promise((resolve, reject) => {
    Template.compileVisitCounter(hotspot.id, hotspot.place_id).then((counter) => {
      resolve(S3connection.uploadFile(path, counter, true));
    }).catch((err) => {
      reject(err);
    });
  });
};


const buildActivityCatcher = function (hotspot, questions) {
  return {
    title: `Actividad en portal ${hotspot.id}`,
    is_active: true,
    questions,
  };
};

const saveActivityCatcher = function (folderPath, template_id, hotspot) {
  return new Promise((resolve, reject) => {
    const questions = TemplateInformation.activityCatcher[template_id];
    const params = buildActivityCatcher(hotspot, questions);
    Survey.save(params).then((survey) => {
      Template.compileActivityCatcher(folderPath, template_id, survey).then((activityCatcher) => {
        const path = `${folderPath}/activityCatcher.js`;
        resolve(S3connection.uploadFile(path, activityCatcher, true));
      }).catch((err) => {
        reject(err);
      });
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

const saveToDB = function (params, url) {
  params.url = url;
  console.log(params);
  return Hotspot.save(params);
};


exports.get = function (req, res) {
  const hotspot_id = req.params.id;
  Hotspot.findById(hotspot_id).then((hotspot) => {
    Requestify.get(hotspot.url).then((html) => {
      res.send(html.body);
    }).catch((err) => {
      // TODO: respond with default hotspot? or error hotspot?
    });
  }).catch((err) => {
    // TODO: respond with default hotspot
  });
};
