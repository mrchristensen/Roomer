var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

async function getEmail(userID) {
    let params = {
        TableName: "ROOMER_USERS",
        AttributesToGet: ["USER_EMAIL"],
        Key: { "USER_ID": userID }
    };

    try {

        var result = await docClient.get(params).promise();

    } catch (err) {

        console.log("Error retreiving email: ", err)

        return {
            statusCode: 500,
            body: JSON.stringify('Server Error'),
        };
    }

    return result;
}

module.exports = { getEmail };