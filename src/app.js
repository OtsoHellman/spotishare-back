const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

require('dotenv').config()

const middlewares = require('./middlewares')
const song = require('./api/song')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: process.env.REDIRECTURI
})

spotifyApi.setAccessToken(process.env.ACCESSTOKEN)

app.use('/api/song', song)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
