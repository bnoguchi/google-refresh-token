google-refresh-token
====================

Refreshes Google OAuth 2 Access Tokens

## Instructions

```javascript
var refresh = require('google-token-refresh');
refresh(refreshToken, googleClientId, googleSecret, function (err, json, res) {
  if (err) return handleError(err);
  if (json.error) return handleError(new Error(res.statusCode + ': ' + json.error));

  var newAccessToken = json.accessToken;
  if (! accessToken) {
    return handleError(new Error(res.statusCode + ': refreshToken error'));
  }
  var expireAt = new Date(+new Date + parseInt(json.expiresIn, 10));
  handleRefreshedData(newAccessToken, expireAt);
});
```

## MIT License
Copyright (c) 2013 by Brian Noguchi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
