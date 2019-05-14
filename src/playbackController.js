const { Playback } = require('./playback')

const activeHosts = []

exports.addHost = (accessToken, refreshToken) => {
    activeHosts.push(new Playback(accessToken, refreshToken))
}

exports.getHosts = () => activeHosts.map(host => host.hostName)

exports.getHostByName = (hostName) => {
    const filteredHosts = activeHosts.filter(host => host.hostName === hostName)
    return filteredHosts.length > 0 ? filteredHosts[0] : null
}