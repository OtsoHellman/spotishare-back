const SpotifyWebApi = require('spotify-web-api-node')
const config = require('./config')

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri
})

getNewAccessToken = () => {
  spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log('The access token has been refreshed!')
      spotifyApi.setAccessToken(data.body['access_token'])
    },
    function(err) {
      console.log('Could not refresh access token', err)
    }
  )
}
exports.initialize = (accessToken, refreshToken) => {
  console.log(refreshToken)
  spotifyApi.setAccessToken(accessToken)
  spotifyApi.setRefreshToken(refreshToken)
  setInterval(() => getNewAccessToken(), 300000)
}

exports.getPlaybackState = () => {
  return spotifyApi.getMyCurrentPlaybackState()
}

exports.playSongById = (songId) => (spotifyApi.play({"uris": [songId]}))

exports.getSongById = (songId) => (spotifyApi.getTrack(songId))