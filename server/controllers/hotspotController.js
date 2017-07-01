const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');

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
  // const extension = values[key].split('.').pop();
  values[key] = `https://${S3_BUCKET}.s3.amazonaws.com/${path}${key}`;
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
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
    const search = new RegExp(inTextKey, 'g');
    template = template.replace(search, values[keys[i]]);
  }
  return template;
};

exports.upload = function (req, res) {
  const folderPath = `hotspots/${(new Date()).getTime()}`;
  const fileBody = compile(req.body.template_id, req.body.template, req.body.values, folderPath);
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
