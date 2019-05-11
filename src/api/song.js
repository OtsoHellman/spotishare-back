const express = require('express')
const spotify = require('../spotify')

const router = express.Router()

const { songQueue, playNextSong } = require('../playbackController')

router.post('/', (req, res) => {
    if (req.body.songId.slice(0, 14) === "spotify:track:") {
        return spotify.getSongById(req.body.songId.slice(14))
            .then(responseObject => {
                if (responseObject.statusCode === 200) {
                    return res.json(songQueue.push(responseObject.body))
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
    if (songQueue.length > 0) {
        return res.json(songQueue.shift())
    }
    return res.send('Whats the correct status code', 400)
})

router.post('/next', (req, res) => {
    if (songQueue.length > 0) {
        playNextSong()
            .then(res.send(200))
    }
    return res.send('Whats the correct status code', 400)
})

router.post('/move', (req, res) => {
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
})

router.get('/', (req, res) => {
    return res.json(songQueue)
})



module.exports = router
