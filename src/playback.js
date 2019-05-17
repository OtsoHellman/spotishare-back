const { SpotifyApi } = require('./spotify')

exports.Playback = class Playback {
    constructor(accessToken, refreshToken, hash) {
        this.songQueue = []
        this.playbackInterval = false
        this.spotifyApi = new SpotifyApi(accessToken, refreshToken)
        this.hash = hash
        this.startInterval()

        this.spotifyApi.getUserInfo()
            .then(data => this.hostName = data.body.display_name)
            .catch(err => console.log(err))
    }

    addSong = (song) => {
        this.songQueue.push(song)
    }

    removeNextSong = () => {
        if (this.songQueue.length > 0) {
            return this.songQueue.shift()
        }
    }

    playNextSong = () => {
        const nextSongId = this.songQueue.shift().uri
        console.log("Playing next song")
        return this.spotifyApi.playSongById(nextSongId)
            .then(() => new Promise(resolve => setTimeout(resolve, 3000)))
            .catch(err => console.log(err.message))
    }

    pollPlayback = () => this.spotifyApi.getPlaybackState()
        .then(res => {
            const remainingDuration = res.body.item.duration_ms - res.body.progress_ms
            console.log(`Listening to ${res.body.item.name} on ${res.body.device.name}(${res.body.device.type}). Next song in ${parseInt(remainingDuration / 1000) - 3}s`)
            console.log(`Songs still in queue: ${this.songQueue.map(song => "\n" + song.name)}`)
            if (remainingDuration < 3000 && this.songQueue.length > 0) {
                console.log("Duration < 3s")
                return this.playNextSong()
            }
        })
        .catch(err => console.log(err.message))

    startInterval = () => {
        console.log("starting interval")
        this.playbackInterval = true
        const interval = () => {
            if (this.playbackInterval) {
                Promise.all([
                    this.pollPlayback(),
                    new Promise((resolve) => setTimeout(resolve, 1000))
                ]).then(interval)
            }
        }
        interval()
    }
}

