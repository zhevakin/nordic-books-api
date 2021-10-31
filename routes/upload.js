const express = require('express')

const router = express.Router()

var AWS = require('aws-sdk');

router.route('/').post(async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, // Access key ID
    secretAccessKey: process.env.AWS_SECRET_KEY, // Secret access key
    region: "eu-central-1" //Region
  })


  const s3 = new AWS.S3();

  // Binary data base64
  const fileContent  = Buffer.from(req.files.uploadedFile.data, 'binary');

  // Setting up S3 upload parameters
  const params = {
    Bucket: 'nordic-messenger',
    Key: Date.now() + req.files.uploadedFile.name, // File name you want to save as in S3
    Body: fileContent,
    ContentType: req.files.uploadedFile.mimetype,
    ACL: 'public-read'
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    res.send({
      "status": "ok",
      "data": data,
      fileURL: data.Location
    });
  });

})

module.exports = router
