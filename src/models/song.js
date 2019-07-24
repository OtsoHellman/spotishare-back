const database = require('../db.js')
const Sequelize = require('sequelize')

const Song = database.define('song', {
  song_id: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Song
