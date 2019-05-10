const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const SpotifyWebApi = require('spotify-web-api-node')

require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api')

const app = express()

app.use(morgan('dev'))
app.use(helmet())

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: process.env.REDIRECTURI
})

spotifyApi.setAccessToken(process.env.ACCESSTOKEN)

app.get('/', (req, res) => {
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

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
