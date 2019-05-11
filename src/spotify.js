const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: process.env.REDIRECTURI
})

exports.initialize = () => {
  spotifyApi.setAccessToken(process.env.ACCESSTOKEN)
}

exports.getPlaybackState = () => {
  return spotifyApi.getMyCurrentPlaybackState()
}

exports.playSongById = (songId) => {
  return spotifyApi.play({"uris": [songId]})
}

exports.getSongById = (songId) => {
    return spotifyApi.getTrack(songId)
}