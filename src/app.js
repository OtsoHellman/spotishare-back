const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const playbackController = require('./playbackController')
const spotify = require('./spotify')

require('dotenv').config()

const middlewares = require('./middlewares')
const song = require('./api/song')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())


app.use('/api/song', song)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

playbackController.initialize()
spotify.initialize()


module.exports = app
