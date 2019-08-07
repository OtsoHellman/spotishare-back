const cache = require('memory-cache')
const getSpotify = require('./services/spotify')

const { getHostByHash } = require('./services/playbackController')

function notFound(req, res, next) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

// eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
  console.error(err)
  const statusCode = err.status
    ? err.status
    : res.statusCode !== 200
      ? res.statusCode
      : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
}

const FIFTEEN_MINUTES = 15 * 60 * 1000

function authentication(req, res, next) {
  try {
    const accessToken = req.spotishare.access_token
    const refreshToken = req.spotishare.refresh_token
    if (!accessToken) {
      const err = new Error('Not authorized')
      err.status = 400
      return next(err)
    }

    if (cache.get(accessToken)) {
      return next()
    }

    const s = getSpotify({
      accessToken,
      refreshToken
    })

    s.getMe()
        .then(() => {
          req.user = body
          next()
        })
        .catch(() => {
          s.refreshAccessToken()
              .then(({ body: { access_token } }) => {
                req.spotishare.access_token = access_token
                cache.put(access_token, true, FIFTEEN_MINUTES)
                return next()
              })
              .catch(error => {
                console.error(error)
                const err = new Error('Failed to request new access token')
                err.status = 400
                return next(err)
              })
        })
  } catch (error) {
    return next(error)
  }
}

function hostHandler(req, res, next) {
  const session = req.method === 'GET' ? req.query.session : req.body.session
  if (!session) {
    return res.status(400).send('Missing session hash')
  }
  const host = getHostByHash(session)
  if (!host) {
    return res.status(400).send('Invalid hash')
  }
  req.sessionHost = host
  return next()
}

module.exports = {
  notFound,
  errorHandler,
  authentication,
  hostHandler
}
