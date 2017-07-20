const S3_BUCKET = process.env.S3_BUCKET;
const aws = require('aws-sdk');

exports.uploadFile = function (path, body, isPublic) {
  return new Promise((resolve, reject) => {
    const s3bucket = new aws.S3({
      params: {
        Bucket: S3_BUCKET,
      },
    });
    s3bucket.createBucket(() => {
      const params = {
        Key: path,
        Body: body,
      };
      if (isPublic) {
        params.ACL = 'public-read';
      }
      s3bucket.upload(params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
