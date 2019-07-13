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
    if (!req.spotishare.access_token) {
      console.log("perse")
      const err = new Error("Not authorized");
      err.status = 400;
      return next(err);
    }

    if (cache.get(req.spotishare.access_token)) {
      return next()
    }
    console.log("moro")
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
