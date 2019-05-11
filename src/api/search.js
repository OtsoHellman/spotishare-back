const express = require('express')
const spotify = require('../spotify')

const router = express.Router()

router.get('/', (req, res) => {
    const query = req.body.query
    if (!query) {
        return res.send('Missing query parameter', 400)
    }
    return spotify.searchByQuery(query)
        .then(responseObject => res.json(responseObject))
        .catch(err => res.send(err))
})


module.exports = router
