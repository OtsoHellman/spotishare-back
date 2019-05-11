require('dotenv').config()

let clientId = process.env.CLIENTID
let clientSecret = process.env.CLIENTSECRET
let redirectUri = process.env.REDIRECTURI

module.exports = {
    clientId,
    clientSecret,
    redirectUri
}