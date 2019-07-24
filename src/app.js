const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const middlewares = require('./middlewares')
const song = require('./api/song')
const search = require('./api/search')
const session = require('./api/session')
const config = require('./config')
const request = require('request')
const clientSession = require('client-sessions')
const qs = require('query-string')
cookieParser = require('cookie-parser')

const app = express()

app.use(morgan('dev'))
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
)
app.use(helmet())
app.use(bodyParser.json())
app.use(
    clientSession({
        cookieName: 'spotishare',
        secret: 'lihapulle',
    }),
)
app.use(cookieParser())

app.get('/login', (req, res) => {
    const redirectUri = req.query.redirectUri || config.redirectUri
    const scopes = 'user-modify-playback-state user-read-playback-state'
    const query = qs.stringify({
        response_type: 'code',
        client_id: config.clientId,
        scope: encodeURIComponent(scopes),
        redirect_uri: encodeURIComponent(redirectUri),
    })
    res.redirect(`https://accounts.spotify.com/authorize?${query}`)
})

app.get('/ok', (req, res) => {
    const authorization = Buffer
        .from(`${config.clientId}:${config.clientSecret}`)
        .toString('base64')
    request.post({
        uri: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: config.redirectUri,
        },
        headers: {
            Authorization: `Basic ${authorization}`,
        },
    }, (error, response, body) => {
        const data = JSON.parse(body)
        req.spotishare.access_token = data.access_token
        req.spotishare.refresh_token = data.refresh_token
        res.redirect(config.frontUri)
    })
})
app.use(middlewares.authentication)

app.use('/api/song', song)
app.use('/api/session', session)
app.use('/api/search', search)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)


module.exports = app
