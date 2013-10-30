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
  , json: true
  }, function (err, res, body) {
    // `body` should look like:
    // {
    //   "access_token":"1/fFBGRNJru1FQd44AzqT3Zg",
    //   "expires_in":3920,
    //   "token_type":"Bearer",
    // }
    if (err) return cb(err, body, res);
    if (parseInt(res.statusCode / 100, 10) !== 2) {
      if (body.error) {
        return cb(new Error(res.statusCode + ': ' + (body.error.message || body.error)), body, res);
      }
      if (!body.access_token) {
        return cb(new Error(res.statusCode + ': refreshToken error'), body, res);
      }
      return cb(null, body, res);
    }
    cb(null, {
      accessToken: body.access_token
    , expiresIn: body.expires_in
    , expiresAt: +new Date + parseInt(body.expires_in, 10)
    , idToken: body.id_token
    }, res);
  });
}

exports.checkTokenValidity = function (accessToken, refreshToken, clientId, clientSecret, cb) {
  request({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo'
  , qs: {alt: 'json'}
  , json: true
  , headers: { Authorization: 'Bearer ' + accessToken }
  }, function (err, res, json) {
    if (err) return cb(err, json, res);
    cb(null, !json.error)
  });
};
