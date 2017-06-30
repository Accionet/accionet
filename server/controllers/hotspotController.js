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


exports.upload = function (req, res) {
  const fileBody = req.body.compiledHTML;
  // console.log(fileBody);
  const s3bucket = new aws.S3({
    params: {
      Bucket: S3_BUCKET,
    },
  });
  s3bucket.createBucket(() => {
    const params = {
      Key: 'hotspots/login.html', // file.name doesn't exist as a property
      Body: fileBody,
    };
    s3bucket.upload(params, (err, data) => {
      console.log(data);
      if (err) {
        console.log('ERROR MSG: ', err);
        res.status(500).send(err);
      } else {
        console.log('Successfully uploaded data');
        res.status(200).end();
      }
    });
  });
};
