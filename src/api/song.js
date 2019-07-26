const express = require('express')
const { hostHandler } = require('../middlewares')

const router = express.Router()

router.use(hostHandler)

router.post('/', async (req, res) => {
    const host = req.sessionHost
    const { songId } = req.body
    if (!songId || songId.slice(0, 14) !== "spotify:track:") {
        const { statusCode, body: song } = await host.spotifyApi.getSongById(songId.slice(14))
        if (statusCode !== 200) {
            return res.send('Song id not found', 400)
        }
        if (host.songQueue.includes(song)) {
            return res.send('Song already in the queue', 400)
        }
        return res.json(host.addSong(song))
    } else {
        return res.send('Invalid input', 400)
    }
})

router.post('/removeNext', (req, res) => {
    const host = req.sessionHost
    if (host.songQueue.length > 0) {
        return res.json(host.removeNextSong())
    }
    return res.send('No songs in the list', 400)
})

router.post('/next', async (req, res) => {
    const host = req.sessionHost
    if (host.songQueue.length > 0) {
        await host.playNextSong()
        res.send(200)
    }
    return res.send('No songs in the list', 400)
})

router.get('/', (req, res) => {
    const host = req.sessionHost
    return res.json(host.songQueue)
})

router.get('/current', (req, res) => {
    const host = req.sessionHost
    return res.json({
        song: host.currentSong,
        progress: host.currentProgress
    })
})

/* needs to be refactored to use class based playback
router.post('/move', (req, res) => {
   if (!req.params.hash) {
       return res.send('Missing hash', 400)
   }

   const host = getHostByHash(req.params.hash)
   
   if (!host) {
       return res.status(400).send('Invalid hash')
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
