var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var axios = require('axios');

async function validateToken(jwkUrl, token, userId) {
    try {
        result = await axios.get(jwkUrl);
    } catch (error) {
        return false;
    }
    var jwks = result.data;

    var errs = [];
    errs.length = jwks.keys.length;
    var res = {
        success: false,
        errs: []
    };

    for (var i = 0; i < jwks.keys.length; i++) {
        var jwk = jwks.keys[i];
        var pem = jwkToPem(jwk);
        try {
            var decoded = jwt.verify(token, pem, {algorithms: ['RS256']});
            if (decoded.username == userId) {
                res.success = true;
                return res;
            }
            else {
                errs[i] = "Username did not match";
            }
        } catch(err) {
            errs[i] = err;
        }
    }
    res.errs = errs;
    return res;
}

module.exports = {validateToken};