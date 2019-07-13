var cache = require('memory-cache')
const request = require('request')

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = err.status ? err.status : res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}


function authentication(req, res, next) {
  try {
    // check if access token is included in cookies
    if (!req.spotishare.access_token) {
      const err = new Error("Not authorized");
      err.status = 400;
      return next(err);
    }

    // check if access token in cache
    if (cache.get(req.spotishare.access_token)) {
      return next()
    }

    // check if access token is valid
    request.get({
      uri: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': `Bearer ${req.spotishare.access_token}`
      }
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        cache.put(req.spotishare.access_token, true, 900000)
        return next()
      } else {
        const err = new Error("Invalid access token");
        err.status = 400;
        return next(err);
      }
    })

    // try to request valid access token
    request.post({
      uri: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        'refresh_token': req.spotishare.refresh_token
      }
    }, (error, response, body) => {
      const data = JSON.parse(body)
      if (data.access_token) {
        cache.put(access_token, true, 900000)
        req.spotishare.access_token = data.access_token
        return next()
      } else {
        const err = new Error("Failed to request new access token");
        err.status = 400;
        return next(err);
      }
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  notFound,
  errorHandler,
  authentication
};
