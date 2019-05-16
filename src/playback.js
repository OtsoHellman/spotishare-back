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
            .catch(err => console.log(err.message))
    }

    deactivateInterval = () => {
        clearInterval(this.playbackInterval)
        this.playbackInterval = false
    }

    pollPlayback = () => this.spotifyApi.getPlaybackState()
        .then(res => {
            const progress = res.body.progress_ms
            const duration = res.body.item.duration_ms
            console.log(`Listening to ${res.body.item.name} on ${res.body.device.name}(${res.body.device.type}). Next song in ${parseInt((duration - progress) / 1000) - 3}s`)
            console.log(`Songs still in queue: ${this.songQueue.map(song => "\n"+song.name)}`)
            if (duration - progress < 3000 && this.songQueue.length > 0 && this.playbackInterval) {
                this.deactivateInterval()
                this.playNextSong()
                    .then(this.startInterval())
            }
        })
        .catch(err => console.log(err.message))

    startInterval = () => {
        this.playbackInterval = setInterval(() => this.pollPlayback(), 1000)
    }
}

