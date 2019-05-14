const spotify = require('./spotify')

const songQueue = []
let playbackInterval = false

const playNextSong = () => {
    const nextSongId = songQueue.shift().uri
    console.log("Playing next song")
    return spotify.playSongById(nextSongId)
        .catch(err => console.log(err.message))
}

const deactivateInterval = () => {
    clearInterval(playbackInterval)
    playbackInterval = false
}

const pollPlayback = () => spotify.getPlaybackState()
    .then(res => {
        const progress = res.body.progress_ms
        const duration = res.body.item.duration_ms
        console.log(`Listening to ${res.body.item.name} on ${res.body.device.name}(${res.body.device.type}). Next song in ${parseInt((duration - progress) / 1000) - 3}s`)
        if (duration - progress < 3000 && songQueue.length > 0 && playbackInterval) {
            deactivateInterval(playbackInterval)
            playNextSong()
                .then(startInterval())
        }
    })
    .catch(err => console.log(err.message))

const startInterval = () => {
    playbackInterval = setInterval(() => pollPlayback(), 1000)
}

exports.songQueue = songQueue
exports.startInterval = startInterval
exports.playNextSong = playNextSong