/*
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();
*/

var mongoose = require('mongoose');

async function addPost(uri, userID, isoPost, location, housingType, minCost, maxCost, tags, startDate, endDate, roomType, layout) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var isoPost = new isoModel({
        userID: userID,
        isoPost: isoPost,
        location: location,
        housingType: housingType,
        minCost: minCost,
        maxCost: maxCost,
        tags: tags,
        startDate: startDate,
        endDate: endDate,
        roomType: roomType,
        layout: layout
    });

    var result;

    await isoPost.save();

    //if (err) result = {statusCode: 500, body: err};
    //else result = {statusCode: 200, body: "post added successfully"};

    return result;

    /*
    let params = {
        TableName: "ISO_POSTS",
        //ExpressionAttributeNames: { "#S": "STATUS", "#D": "DATE", "#L": "LOCATION" },
        Item: {
            "POST_ID": Date.now(), "DATE": Date.now(), "ISO_POST": isoPost,
            "LOCATION": location, "STATUS": "unresolved", "USER_ID": userID
        }
        //generate POST_ID UUID in a better way before production 
        //this will make a unique ID at least
    };

    //if housingType exists, then set it as an attribute
    if (housingType && housingType != null) {
        params["Item"]["HOUSING_TYPE"] = housingType;
    }

    //if minCost and maxCost exist, then set it them as attributes
    if (minCost && minCost != null && maxCost && maxCost != null) {
        params["Item"]["MIN_COST"] = minCost;
        params["Item"]["MAX_COST"] = maxCost;
    }

    //if tags exists, then set it as an attribute
    if (tags && tags != null) {
        params["Item"]["TAGS"] = tags;
    }

    try {

        var result = await docClient.put(params).promise();

    } catch (err) {

        console.log("Error posting: ", err)

        return {
            statusCode: 500,
            body: JSON.stringify('Server Error'),
        };
    }

    return result;
    */
}

async function getPost(uri, postId) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var result = await isoModel.findById(postId);

    return result;
}

async function deletePost(uri, postId) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var result
    
    await isoModel.findByIdAndDelete(postId);

    return result;
}

async function resolvePost(uri, postId) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var result
    
    await isoModel.findByIdAndUpdate(postId, {status: "resolved"});

    return result;
}

async function unresolvePost(uri, postId) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var result
    
    await isoModel.findByIdAndUpdate(postId, {status: "unresolved"});

    return result;
}

async function editPost(uri, postId, isoPost, location, housingType, minCost, maxCost, tags, startDate, endDate, roomType, layout) {

    mongoose.connect(uri)

    var isoSchema = mongoose.Schema({
        postedDate: { type: Date, default: Date.now },
        userID: String,
        isoPost: String,
        status: {type: String, default: "unresolved"},
        location: String,
        housingType: String,
        minCost: Number,
        maxCost: Number,
        tags: [String],
        startDate: Date,
        endDate: Date,
        roomType: String,
        layout: String
    });

    var isoModel = mongoose.models.isoPost || mongoose.model('isoPost', isoSchema);

    var edit = {};

    if (isoPost && isoPost != null) {
        edit.isoPost = isoPost;
    }

    if (location && location != null) {
        edit.location = location;
    }

    if (housingType && housingType != null) {
        edit.housingType = housingType;
    }
    
    if (minCost && minCost != null) {
        edit.minCost = minCost;
    }

    if (maxCost && maxCost != null) {
        edit.maxCost = maxCost;
    }

    if (tags && tags != null) {
        edit.tags = tags;
    }
    
    if (startDate && startDate != null) {
        edit.startDate = startDate;
    }

    if (endDate && endDate != null) {
        edit.endDate = endDate;
    }

    if (roomType && roomType != null) {
        edit.roomType = roomType;
    }

    if (layout && layout != null) {
        edit.layout = layout;
    }

    var result;

    await isoModel.findByIdAndUpdate(postId, edit);

    return result;
}

module.exports = { addPost, getPost, deletePost, resolvePost, unresolvePost, editPost };