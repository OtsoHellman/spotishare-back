const express = require('express')

const router = express.Router()

const { getHostByName } = require('../playbackController')

router.post('/', (req, res) => {
    if (!req.body.hostName) {
        return res.send('Missing hostName', 400)
    }

    const host = getHostByName(req.body.hostName)

    if (!host) {
        return res.status(400).send('Invalid hostName')
    }

    if (req.body.songId.slice(0, 14) === "spotify:track:") {
        return host.spotifyApi.getSongById(req.body.songId.slice(14))
            .then(responseObject => {
                if (responseObject.statusCode === 200) {
                    return res.json(host.addSong(responseObject.body))
                } else {
                    return res.send('Song id not found', 400)
                }
            })
            .catch(err => res.send(err))
    } else {
        return res.send('Invalid input', 400)
    }

})

router.post('/removeNext', (req, res) => {
    if (!req.body.hostName) {
        return res.send('Missing hostName', 400)
    }

    const host = getHostByName(req.body.hostName)

    if (!host) {
        return res.status(400).send('Invalid hostName')
    }

    if (host.songQueue.length > 0) {
        return res.json(host.removeNextSong())
    }
    return res.send('Whats the correct status code', 400)
})

router.post('/next', (req, res) => {
    if (!req.body.hostName) {
        return res.send('Missing hostName', 400)
    }

    const host = getHostByName(req.body.hostName)

    if (!host) {
        return res.status(400).send('Invalid hostName')
    }

    if (host.songQueue.length > 0) {
        host.playNextSong()
            .then(res.send(200))
    }
    return res.send('Whats the correct status code', 400)
})

router.get('/', (req, res) => {

    if (!req.query.hostName) {
        return res.status(400).send('Missing hostName')
    }

    const host = getHostByName(req.query.hostName)

    if (!host) {
        return res.status(400).send('Invalid hostName')
    }

    return res.json(host.songQueue)
})

/* needs to be refactored to use class based playback
router.post('/move', (req, res) => {
   if (!req.query.hostName) {
       return res.send('Missing hostName', 400)
   }

   const host = getHostByName(req.query.hostName)
   
   if (!host) {
       return res.status(400).send('Invalid hostName')
   }

   const { songId, moveUp } = req.body
   const songIndex = songQueue.findIndex(songObject => songObject.uri === songId)

   if (songIndex === -1) {
       return res.send('Song not in queue', 400)
   }

   if ((moveUp === true && songIndex <= 0) || (moveUp === false && songIndex >= songQueue.length - 1)) {
       return res.send('Invalid move', 400)
   }

   const nextIndex = moveUp ? songIndex -1 : songIndex + 1
   const swapSong = songQueue[nextIndex]
   songQueue[nextIndex] = songQueue[songIndex]
   songQueue[songIndex] = swapSong

   res.send(200)
})*/

module.exports = router
