const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const playbackController = require('./playbackController')
const middlewares = require('./middlewares')
const song = require('./api/song')
const search = require('./api/search')
const config = require('./config')
const request = require('request')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())


app.use('/api/song', song)
app.use('/api/search', search)

app.get('/login', (req, res) => {
    var scopes = 'user-modify-playback-state user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + config.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(config.redirectUri))
})

app.get('/ok', (req, res) => {
    const authorization = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')
    request.post({
        uri: 'https://accounts.spotify.com/api/token',
        form: { code: req.query.code, grant_type: 'authorization_code', redirect_uri: config.redirectUri },
        headers: {
            'Authorization': `Basic ${authorization}`
        }
    }, (error, response, body) => {
        const data = JSON.parse(body)
        const hash = playbackController.addHost(data.access_token, data.refresh_token)
        res.redirect(config.frontUri+hash) 
    })
})

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)


module.exports = app
