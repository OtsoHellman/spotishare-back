const spotify = require('./spotify')

const songQueue = []
let playbackInterval

const playNextSong = () => {
    const nextSongId = songQueue.shift().uri
    return spotify.playSongById(nextSongId)
        .catch(err => console.log(err.message))
        .then(startInterval())
}

const pollPlayback = () => spotify.getPlaybackState()
    .then(res => {
        const progress = res.body.progress_ms
        const duration = res.body.item.duration_ms

        if (duration - progress < 6000 && songQueue.length > 0) {
            clearInterval(playbackInterval)
            playNextSong()
        }
    })
    .catch(err => console.log(err.message))

const startInterval = () => {
    playbackInterval = setInterval(() => pollPlayback(), 3000)
}

exports.songQueue = songQueue
exports.startInterval = startInterval