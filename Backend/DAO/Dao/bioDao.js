var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

async function getBio(userID) {
  let params = {
    TableName: "ROOMER_USERS",
    AttributesToGet: ["USER_BIO"],
    Key: { USER_ID: userID },
  };

  try {
    var result = await docClient.get(params).promise();
  } catch (err) {
    console.log("Error retreiving bio: ", err);

    return {
      statusCode: 500,
      body: JSON.stringify("Server Error"),
    };
  }

  return result;
}

async function setBio(userID, newBio) {
  let params = {
    TableName: "ROOMER_USERS",
    Key: { USER_ID: userID },
    UpdateExpression: "SET USER_BIO = :bio",
    ExpressionAttributeValues: {
      ":bio": newBio,
    },
  };

  try {
    var result = await docClient.update(params).promise();
  } catch (err) {
    console.log("Error retreiving bio: ", err);

    return {
      statusCode: 500,
      body: JSON.stringify("Server Error"),
    };
  }

  return result;
}

module.exports = { getBio, setBio };
