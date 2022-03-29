var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');

function validateToken(jwk, token, userId) {
    var pem = jwkToPem(jwk);
    try {
        var decoded = jwt.verify(token, pem);
        if (true) return true; //validate that this is the same user as the userId
        else return false;
    } catch(err) {
        return false;
    }
}

module.exports = {validateToken};