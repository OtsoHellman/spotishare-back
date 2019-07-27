const { Playback } = require('./playback')
const crypto = require('crypto')
const activeHosts = []

exports.addHost = (accessToken, refreshToken) => {
    const hash = crypto.randomBytes(10).toString('hex')
    activeHosts.push(new Playback(accessToken, refreshToken, hash))
    return hash
}

exports.getHosts = () => activeHosts

exports.getHostByHash = hash => {
    const filteredHosts = activeHosts.filter(host => host.hash === hash)
    return filteredHosts.length > 0 ? filteredHosts[0] : null
}

exports.getHostByRefreshToken = token => activeHosts.find(host => host.spotifyApi.spotifyWebApi.getRefreshToken() === token) || null
