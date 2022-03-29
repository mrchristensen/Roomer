import axios from 'axios';
const AWS = require('aws-sdk');

const API_GATEWAY =
  'https://API_GATEWAY.execute-api.us-east-2.amazonaws.com/Sprint_4';

const GEOCODE_API = 
  'https://maps.googleapis.com/maps/api/geocode/json';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

export async function getFeed(pageSize, lastPostId, housingType, location, housingPrice, moveInDate, tags, roomType, layout) {
  try {
    let response = await axios.post(API_GATEWAY + '/getfeed', {
      pageSize: pageSize,
      lastPostId: lastPostId,
      housingType: housingType,
      location: location,
      housingPrice: housingPrice,
      moveInDate: moveInDate,
      tags: tags,
      roomType: roomType,
      layout: layout
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function getUserEmail(userID, loginToken) {
  //TODO: login token in the authorization header

  try {
    let response = await axios.get(API_GATEWAY + '/getemail/' + userID,
    {
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data.Item.USER_EMAIL;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function addPost(userId, isoPost, location, housingType, roomType, layout, minCost, maxCost, tags, startDate, endDate, loginToken) {
  try {
    //TODO: login token in the authorization header
    console.log(userId, isoPost, location, housingType, roomType, layout, minCost, maxCost, tags, startDate, endDate, loginToken);

    let response = await axios.post(API_GATEWAY + '/addpost', {
      userId: userId, 
      isoPost: isoPost, 
      location: location, 
      housingType: housingType, 
      roomType: roomType,
      layout: layout,
      minCost: minCost, 
      maxCost: maxCost, 
      tags: tags, 
      startDate: startDate, 
      endDate: endDate
    }, {
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function getUserAccountBio(userID, loginToken) {
  try {
    let response = await axios.get(API_GATEWAY + '/getbio/' + userID,
    {
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function getUserAccountPosts(userId, pageSize, lastPostId, showUnresolved, loginToken) {
  try {

    let response = await axios.post(API_GATEWAY + '/getuserposts', {
      userId: userId,
      pageSize: pageSize,
      lastPostId: lastPostId,
      showUnresolved: showUnresolved,
    },{
      headers: {
        'Authorization': loginToken,
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function resolvePostStatus(postId, loginToken) {
  try {
    let response = await axios.post(API_GATEWAY + '/resolvepost', {
      postId: postId,
    },{
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function unresolvePostStatus(postId, loginToken) {
  try {
    let response = await axios.post(API_GATEWAY + '/unresolvepost', {
      postId: postId,
    },{
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function editUserAccountBio(userId, userBio, loginToken) {
  try {
    let response = await axios.post(API_GATEWAY + '/setbio', {
      userId: userId,
      userBio: userBio
    },{
      headers: {
        'Authorization': loginToken
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function getCoordinates(location) {
  console.log('Getting coordinates for ' + location);

  try {
    let response = await axios.get(GEOCODE_API, {
      params: {
        address: location,
        key: API_KEY
      }
    });

    return response
  } catch (error) {
    console.log(error);
  }

}

export async function createUser(userID, userEmail, username) {
  console.log('Creating user in db')

  try {
    let response = await axios.post(API_GATEWAY + '/adduser', {
      userID: userID,
      userEmail: userEmail,
      username: username
    });

    return response
  } catch (error) {
    console.log(error)
  }

}

export async function getUsername (userID) {
  console.log('Getting username in db')

  try {
    let response = await axios.get(API_GATEWAY + '/getusername/' + userID);
    
    return response.data
  } catch (error) {
    console.log(error)
  }

}