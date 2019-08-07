const express = require('express')
const playbackController = require('../services/playbackController')

const router = express.Router()

router.get('/', (req, res) => {
    const session = playbackController.getHostByUserId(req.spotishare.userId)
    res.json(session && {
        owner: session.owner,
        hash: session.hash
    })
})

router.get('/:hash', (req, res) => {
    const session = playbackController.getHostByHash(req.params.hash)
    res.json(session && {
        owner: session.owner,
        hash: session.hash
    })
})

router.post('/', (req, res, next) => {
    if (playbackController.getHostByUserId(req.spotishare.userId)) {
        return res.status(400).send('Active session already exists for host')
    }
    playbackController.addHost(req.spotishare.accessToken, req.spotishare.refreshToken, req.spotishare.userId)
        .then(hash => res.json({ hash }))
        .catch(next)
})

router.delete('/', (req, res) => {
    const session = playbackController.getHostByUserId(req.spotishare.userId)
    if (session) {
        playbackController.deleteHost(session)
        return res.sendStatus(200)
    }
    res.status(400).send('No active session')
})
module.exports = router
