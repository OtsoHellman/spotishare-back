const express = require('express')
const { getHosts, getHostByName } = require('../playbackController')

const router = express.Router()

router.get('/', (req, res) => {
    if (!req.query.hostName) {
        return res.status(400).send('Missing hostName')
    }

    const host = getHostByName(req.query.hostName)

    if (!host) {
        return res.status(400).send('Invalid hostName')
    }

    if (!req.query.searchQuery) {
        return res.status(400).send('Missing query parameter')
    }

    return host.spotifyApi.searchByQuery(req.query.searchQuery)
        .then(responseObject => res.json(responseObject))
        .catch(err => res.send(err))
})


module.exports = router
