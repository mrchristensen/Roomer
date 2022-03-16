var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

async function addUser(userID, userEmail, username) {
    let params = {
        TableName: "ROOMER_USERS",
        Item: {
            "USER_ID": userID, "USER_EMAIL": userEmail, "USERNAME": username, 
            "USER_BIO": "Hello! I'm new to Roomer!" 
        }
    };

    try {

        var result = await docClient.put(params).promise();

    } catch (err) {

        console.log("Error adding user: ", err)

        return {
            statusCode: 500,
            body: JSON.stringify('Server Error'),
        };
    }

    return result;
}

module.exports = { addUser };