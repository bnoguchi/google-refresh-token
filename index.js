var request = require('request');
/**
 * @param {String} refreshToken is the refresh token returned from the
 *   authorization code exchange.
 * @param {String} clientId is the client_id obtained during application registration.
 * @param {String} clientSecret is the client secret obtained during the
 *   application registration.
 * @param {Function} cb(err, {accessToken, expiresIn, idToken}, response);
 */
module.exports = function refreshToken (refreshToken, clientId, clientSecret, cb) {
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
};
