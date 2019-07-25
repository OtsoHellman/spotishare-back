const express = require('express')
const playbackController = require('../services/playbackController')

const router = express.Router()

router.get('/', (req, res) => {
    const session = playbackController.getHosts().find(host => host.spotifyApi.spotifyWebApi.getRefreshToken() === req.spotishare.refresh_token)
    res.json(session || null)
})

router.post('/', (req, res) => {
    if (playbackController.getHosts().map(host => host.spotifyApi.spotifyWebApi.getRefreshToken()).includes(req.spotishare.refresh_token)) {
        return res.status(400).send('Active session already exists for host')
    }
    const hash = playbackController.addHost(req.spotishare.access_token, req.spotishare.refresh_token)
    res.json({ hash })
})

module.exports = router
