/*
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();
*/

var mongoose = require('mongoose');

//const uri = 'mongodb://roomerUser:roomerMayHaveIt2022@3.15.225.58:27017/roomerDB';

async function getFeed(uri, pageSize, lastPostId, housingType, housingPrice, location, moveInDate, tags, roomType, layout) {
  
  mongoose.connect(uri);

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

  var query = {
    status: "unresolved"
  };

  //add query parameters here

  if (lastPostId && lastPostId != null) {
    query._id = { $lt: lastPostId };
  }

  if (housingType && housingType != null) {
    query.housingType = housingType;
  }

  if (housingPrice && housingPrice != null) {
    query.minCost = { $lte: housingPrice };
    query.maxCost = { $gte: housingPrice };
  }

  if (location && location != null) {
      query.location = location;
  }

  if (moveInDate && moveInDate != null) {
    query.startDate = { $lte: moveInDate };
    query.endDate = { $gte: moveInDate };
  }

  if (tags && tags != null) {
    query.tags = { $all: tags };
  } 

  if (roomType && roomType != null) {
    query.roomType = roomType;
  }

  if (layout && layout != null) {
    query.layout = layout;
  }

  var result = await isoModel.find(query).sort({postedDate:-1}).limit(pageSize);

  return result;
  
  /*
  let params = {
    TableName: "ISO_POSTS",
    IndexName: "ACTIVE_POSTS",
    KeyConditionExpression: '#S = :stat',
    ExpressionAttributeNames: { "#S": "STATUS" },
    ExpressionAttributeValues: { ':stat': 'unresolved' },
    Limit: pageSize,
    ScanIndexForward: false
  };

  //if lastPostId and lastPostDate exists, then set them as exclusive start key
  if (lastPostId && lastPostId != null && lastPostDate && lastPostDate != null) {
    params["ExclusiveStartKey"] = { "POST_ID": lastPostId, "DATE": lastPostDate, "STATUS": "unresolved" }
  }
  //else if lastPostId exists but lastPostDate doesn't (or vice versa) return 400
  else if (!(lastPostId == null && lastPostDate == null)) {
    return {
      statusCode: 400,
      body: JSON.stringify('Bad Request'),
    };
  }

  addFilters(params, housingType, housingPrice);

  try {

    var result = await docClient.query(params).promise();

  } catch (err) {

    console.log("Error scanning for feed: ", err)

    return {
      statusCode: 500,
      body: JSON.stringify('Server Error'),
    };
  }

  if (tags && tags != null) {
    filterTags(result, tags);
  }
  */
}

async function getUserPosts(uri, userId, pageSize, lastPostId, showResolved) {
  
  mongoose.connect(uri);

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

  var query = {
    userID: userId
  };

  if (lastPostId && lastPostId != null) {
    query._id = { $lt: lastPostId };
  }

  if (!showResolved) {
    query.status = "unresolved";
  }

  var result = await isoModel.find(query).sort({postedDate:-1}).limit(pageSize);

  return result;
}

/*

function filterTags(result, tags) {
  for (let i = 0; i < tags.length; i++) {
    result["Items"] = result["Items"].filter(item => inTags(Array.from(item["TAGS"]), tags[i]));
  }
  result["Count"] = result["Items"].length;
}

function inTags(itemTags, tag) {
  for (let iTag of itemTags) {
    if (iTag.trim() == tag.trim()) {
      return true;
    }
  }
  return false;
}

function addFilters(params, housingType, housingPrice) {
  let hasFilter = false;
  let filterString = "";

  if (housingType && housingType != null) {
    if (hasFilter) {
      filterString += " AND ";
    }
    else {
      hasFilter = true;
    }
    params["ExpressionAttributeValues"][":houseType"] = housingType;
    filterString += "(HOUSING_TYPE = :houseType)";
  }

  if (housingPrice && housingPrice != null) {
    if (hasFilter) {
      filterString += " AND ";
    }
    else {
      hasFilter = true;
    }
    params["ExpressionAttributeValues"][":housePrice"] = housingPrice;
    filterString += "(:housePrice BETWEEN MIN_COST AND MAX_COST)";
  }

  if (tags && tags != null) {
    for (let i = 0; i < tags.length; i++) {
      if (hasFilter) {
        filterString += " AND ";
      }
      else {
        hasFilter = true;
      }
      params["ExpressionAttributeValues"][":tag" + i] = tags[i];
      filterString += "(CONTAINS(TAGS, :tag" + i + "))";
    }
  }

  if (filterString != "") {
    params["FilterExpression"] = filterString;
  }
}

*/

module.exports = { getFeed, getUserPosts };