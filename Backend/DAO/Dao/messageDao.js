var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

async function addMessage(postID, userID, messageSubject, messageBody, recipientID) {
    let params = {
        TableName: "USER_MESSAGES",
        Item: {
            "POST_ID": postID, 
            "POST_DATE": Date.now(),
            "USER_ID": userID ,
            "MESSAGE_SUBJECT": messageSubject,
            "MESSAGE_BODY": messageBody,
            "RECIPIENT_ID": recipientID
        }
    };

    try {

        var result = await docClient.put(params).promise();

    } catch (err) {

        console.log("Error adding message: ", err)

        return {
            statusCode: 500,
            body: JSON.stringify('Server Error'),
        };
    }

    return result;
}

async function getMessages(userID, pageSize, lastPostId, lastPostDate) {
    let params = {
        TableName: "USER_MESSAGES",
        IndexName: "GET_USER_MESSAGES",
        KeyConditionExpression: '#U = :userid',
        ExpressionAttributeNames: { "#U": "USER_ID" },
        ExpressionAttributeValues: { ':userid': userID },
        Limit: pageSize,
        ScanIndexForward: false
    };

    //if lastPostId and lastPostDate exists, then set them as exclusive start key
    if (lastPostId && lastPostId != null && lastPostDate && lastPostDate != null) {
        params["ExclusiveStartKey"] = { "POST_ID": lastPostId, "POST_DATE": lastPostDate, "USER_ID": userID }
    }
    //else if lastPostId exists but lastPostDate doesn't (or vice versa) return 400
    else if (!(lastPostId == null && lastPostDate == null)) {
        return {
            statusCode: 400,
            body: JSON.stringify('Bad Request'),
        };
    }

    try {

        var result = await docClient.query(params).promise();

    } catch (err) {

        console.log("Error retreiving messages: ", err)

        return {
            statusCode: 500,
            body: JSON.stringify('Server Error'),
        };
    }

    return result;
}

module.exports = { addMessage, getMessages};