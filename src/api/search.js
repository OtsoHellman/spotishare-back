const express = require('express')
const { getHostByHash } = require('../services/playbackController')

const router = express.Router()

router.get('/:hash', (req, res) => {
    if (!req.params.hash) {
        return res.status(400).send('Missing hash')
    }

    const host = getHostByHash(req.params.hash)

    if (!host) {
        return res.status(400).send('Invalid hash')
    }

    if (!req.query.searchQuery) {
        return res.status(400).send('Missing query parameter')
    }

    return host.spotifyApi.searchByQuery(req.query.searchQuery)
        .then(responseObject => res.json(responseObject))
        .catch(err => res.send(err))
})


module.exports = router
