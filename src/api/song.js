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
        songQueue.shift()
    }
})

router.post('/next', (req, res) => {
    if (songQueue.length > 0) {
        playNextSong()
    }
})

router.get('/', (req, res) => {
    return res.json(songQueue)
})



module.exports = router
