var request = require('request');
/**
 * @param {String} refreshToken is the refresh token returned from the
 *   authorization code exchange.
 * @param {String} clientId is the client_id obtained during application registration.
 * @param {String} clientSecret is the client secret obtained during the
 *   application registration.
 * @param {Function} cb(err, {accessToken, expiresIn, idToken}, response);
 */
exports = module.exports = refreshGoogleToken;

function refreshGoogleToken (refreshToken, clientId, clientSecret, cb) {
  request.post('https://accounts.google.com/o/oauth2/token', {
    form: {
      refresh_token: refreshToken
    , client_id: clientId
    , client_secret: clientSecret
    , grant_type: 'refresh_token'
    }
  }, function (err, res, body) {
    // `body` should look like:
    // {
    //   "access_token":"1/fFBGRNJru1FQd44AzqT3Zg",
    //   "expires_in":3920,
    //   "token_type":"Bearer",
    // }
    if (err) return cb(err);
    if (parseInt(res.statusCode / 100, 10) !== 2) {
      cb(null, {}, res);
    } else {
      body = JSON.parse(body);
      cb(null, {
        accessToken: body.access_token
      , expiresIn: body.expires_in
      , idToken: body.id_token
      }, res);
    }
  });
}

exports.checkTokenValidity = function (accessToken, refreshToken, clientId, clientSecret, cb) {
  request({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo'
  , qs: {alt: 'json'}
  , json: true
  , headers: { Authorization: 'Bearer ' + accessToken }
  }, function (err, res, json) {
    if (err) return cb(err);
    if (json.error && json.error.message === 'Invalid Credentials') {
      refreshGoogleToken(refreshToken, clientId, clientSecret, function (err, json, res) {
        if (!err && json.error) {
          err = new Error(res.statusCode + ': ' + json.error.message);
        }
        var accessToken = json.accessToken;
        if (!err && !accessToken) {
          err = new Error(res.statusCode + ': refreshToken error');
        }
        if (err) return cb(err);
        var expireAt = +new Date + parseInt(json.expiresIn, 10);
        cb(null, false, accessToken, expireAt);
      });
    } else {
      cb(null, true);
    }
  });
};
