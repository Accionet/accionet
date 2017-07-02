const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const Hotspot = require('../models/hotspot');
const Requestify = require('requestify');
const Template = require('../services/Template');


const S3_BUCKET = process.env.S3_BUCKET;

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

exports.ignedRequest = function (req, res) {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
};

const changeImageValue = function (values, key, path) {
  values[key] = `${path}${key}`;
  return values;
};

const changeImages = function (template_id, values, path) {
  switch (template_id) {
  case 'LANDING-PAGE':
    values = changeImageValue(values, 'IMAGE-PATH', path);
    values = changeImageValue(values, 'BACKGROUND-IMAGE', path);
    break;
  default:
    break;
  }
  return values;
};

const compile = function (template_id, template, values, folder) {
  const path = `${folder}/images/`;
  values = changeImages(template_id, values, path);
  template = Template.compile(template, values);
  return template;
};


exports.save = function (req, res) {
  const folderPath = `hotspots/${(new Date()).getTime()}`;
  const basePath = `https://s3.amazonaws.com/${S3_BUCKET}/`;
  const filePath = `${folderPath}/login.html`;
  saveToDB(basePath + filePath, req.body.template_id).then((hotspot) => {
    saveCounter(hotspot).then(() => {
      saveActivityCatcher(hotspot).then(() => {
        return uploadHTML(folderPath, req, res);
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

const uploadHTML = function (folderPath, req, res) {
  const basePath = `https://s3.amazonaws.com/${S3_BUCKET}/`;
  const absolutePath = basePath + folderPath;
  const fileBody = compile(req.body.template_id, req.body.template, req.body.values, absolutePath);
  const filePath = `${folderPath}/login.html`;
  const s3bucket = new aws.S3({
    params: {
      Bucket: S3_BUCKET,
    },
  });
  s3bucket.createBucket(() => {
    const params = {
      Key: filePath,
      Body: fileBody,
      ACL: 'public-read',
    };
    s3bucket.upload(params, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({
          imageFolder: `${folderPath}/images/`,
        });
      }
    });
  });
};

exports.upload = function (req, res) {
  const folderPath = `hotspots/${(new Date()).getTime()}`;
  const basePath = `https://s3.amazonaws.com/${S3_BUCKET}/`;
  const absolutePath = basePath + folderPath;
  const fileBody = compile(req.body.template_id, req.body.template, req.body.values, absolutePath);
  const filePath = `${folderPath}/login.html`;
  const s3bucket = new aws.S3({
    params: {
      Bucket: S3_BUCKET,
    },
  });
  saveToDB(basePath + filePath, req.body.template_id).then(() => {
    s3bucket.createBucket(() => {
      const params = {
        Key: filePath,
        Body: fileBody,
        ACL: 'public-read',
      };
      s3bucket.upload(params, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({
            imageFolder: `${folderPath}/images/`,
          });
        }
      });
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
};

const saveCounter = function () {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

const saveActivityCatcher = function () {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

const saveToDB = function (url, template) {
  const params = {
    url,
    template,
  };
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
