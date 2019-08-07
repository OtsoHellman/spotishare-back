const { Playback } = require('./playback')
const crypto = require('crypto')
let activeHosts = []

exports.addHost = async (accessToken, refreshToken, userId) => {
    const hash = crypto.randomBytes(10).toString('hex')
    const playback = new Playback(accessToken, refreshToken, hash, userId)
    activeHosts.push(playback)
    await playback.initOwner()
    return hash
}

exports.deleteHost = host  => {
    host.terminate()
    activeHosts = activeHosts.filter(activeHost => activeHost !== host)
}

exports.getHosts = () => activeHosts

exports.getHostByHash = hash => {
    return activeHosts.find(host => host.hash === hash)
}

exports.getHostByUserId = userId => activeHosts.find(host => host.owner.id === userId)
