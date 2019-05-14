const SpotifyWebApi = require('spotify-web-api-node')
const config = require('./config')

exports.SpotifyApi = class SpotifyApi {
  constructor(accessToken, refreshToken) {
    this.spotifyWebApi = new SpotifyWebApi({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri
    })
    this.spotifyWebApi.setAccessToken(accessToken)
    this.spotifyWebApi.setRefreshToken(refreshToken)
    setInterval(() => this.getNewAccessToken(), 3000000)
  }
  getNewAccessToken = () => {
    this.spotifyWebApi.refreshAccessToken()
      .then(data => {
        console.log('The access token has been refreshed!')
        this.spotifyWebApi.setAccessToken(data.body['access_token'])
      })
      .catch(err => console.log('Could not refresh access token', err))
  }
  searchByQuery = (query) => this.spotifyWebApi.searchTracks(query)

  getPlaybackState = () => this.spotifyWebApi.getMyCurrentPlaybackState()

  playSongById = (songId) => this.spotifyWebApi.play({ "uris": [songId] })

  getSongById = (songId) => this.spotifyWebApi.getTrack(songId)

  getUserInfo = () => this.spotifyWebApi.getMe()
}


