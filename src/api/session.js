const express = require('express')
const config = require('../config')
const playbackController = require('../services/playbackController')

const router = express.Router()

router.post('/', (req, res) => {
    try {
        if (!req.spotishare.access_token || !req.spotishare.refresh_token) {
            return res.status(400).send('Missing token')
        }

        if (playbackController.getHosts().map(host => host.spotifyApi.spotifyWebApi.getRefreshToken()).includes(req.spotishare.refresh_token)) {
            return res.status(400).send('Active session already exists for host')
        }

        const hash = playbackController.addHost(req.spotishare.access_token, req.spotishare.refresh_token)
        console.log(hash)

        return res.json({ hash })
    } catch (error) {
        console.log(error)

    }

})

module.exports = router
