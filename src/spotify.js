const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')

const router = express.Router()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: process.env.REDIRECTURI
})

spotifyApi.setAccessToken(process.env.ACCESSTOKEN)

router.get('/', (req, res) => {
  // Get Elvis' albums
  spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    (data) => {
      res.json(data.body)
    },
    (err) => {
      console.error(err)
    }
  )
})

module.exports = router
