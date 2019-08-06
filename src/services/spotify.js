const SpotifyWebApi = require('spotify-web-api-node')
const config = require('../config')

const getSpotify = (options = {}) => new SpotifyWebApi({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    ...options
})

module.exports = getSpotify
