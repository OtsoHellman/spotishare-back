const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')

const router = express.Router()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: process.env.REDIRECTURI
})

const songQueue = []

spotifyApi.setAccessToken(process.env.ACCESSTOKEN)

// add song to queue
router.post('/', (req, res) => res.json(songQueue.push(req.body.songId)))


module.exports = router
