const Song = require('../models/song')

async function updateSongs(song) {
  try {
    await Song.sync()
    return Song.create({song_id: song})
  } catch (error) {
    return { error: error }
  }
}

module.exports = {
  updateSongs
}
