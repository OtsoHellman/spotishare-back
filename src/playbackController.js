const spotify = require('./spotify')

const songQueue = ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']


const playNextSong = () => {
    const nextSongId = songQueue.shift()
    spotify.playSongById(nextSongId)
}

const pollPlayback = () => spotify.getPlaybackState()
    .then(res => {
        const progress = res.body.progress_ms
        const duration = res.body.item.duration_ms

        if (duration - progress < 3000 && songQueue.length > 0) {
            playNextSong()
        }
        console.log(songQueue)
    })
    .catch(err => console.log(err.message))

exports.initialize = () => {
    setInterval(() => pollPlayback(), 1000)
}

exports.songQueue = songQueue