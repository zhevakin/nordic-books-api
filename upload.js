const AWS = require('aws-sdk')

function upload(file) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, // Access key ID
    secretAccessKey: process.env.AWS_SECRET_KEY, // Secret access key
    region: "eu-central-1" //Region
  })

  const s3 = new AWS.S3()

  // Binary data base64
  const fileContent  = Buffer.from(file.data, 'binary');

  // Setting up S3 upload parameters
  const params = {
    Bucket: 'nordic-messenger',
    Key: Date.now() + file.name, // File name you want to save as in S3
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data)
    });
  })
}

module.exports = upload
