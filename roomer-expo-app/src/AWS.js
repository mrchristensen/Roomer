var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-2',
  apiVersion: 'latest',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
}});

const s3 = new AWS.S3();
const AWS_BUCKET_NAME = "AWS_BUCKET_NAME"

const ROOMER_EMAIL = "ROOMER_EMAIL"

export function sendSESEmail(toEmail, fromEmail, subject, message) {
  // Create sendEmail params 
  var params = {
    Destination: { /* required */
      ToAddresses: [
        toEmail
      ]
    },
    Message: { /* required */
      Body: { /* required */
        // Html: {
        //   Charset: "UTF-8",
        //   Data: "HTML_FORMAT_BODY"
        // },
        Text: {
          Charset: "UTF-8",
          Data: message
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: ROOMER_EMAIL, /* required */
    ReplyToAddresses: [
      fromEmail
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

//Creates a S3 file in the Roomer bucket for a specific user and uploads the basic profile picture
export async function addProfileImage(userId) {

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${userId}`,
    CopySource: `/${AWS_BUCKET_NAME}/general_user.png`, 
  }

  s3.copyObject(params, (err, data) => {
    if (err) {
      throw err;
    }
  });
}

//updates S3 file for this user with new image
export function updateProfileImage(userId, imageInfo) {

  const base64Data = Buffer.from(imageInfo.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const type = imageInfo.split(';')[0].split('/')[1];

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${userId}`,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`
  }

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    location.reload();
  });
}
