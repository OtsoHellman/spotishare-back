const express = require('express')
const spotify = require('../spotify')

const router = express.Router()

const { songQueue } = require('../playbackController')

router.post('/', (req, res) => res.json(songQueue.push(req.body.songId)))


module.exports = router
