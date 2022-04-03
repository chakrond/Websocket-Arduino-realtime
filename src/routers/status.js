const express = require('express')
const router = new express.Router()

// View render

router.get('', (req, res) => {

    res.render('index', { // Web Directory **index doesnot required
        title: 'Chat App',
        name: 'Chakron Dechkrut'
    })

})

router.get('/chat', (req, res) => {

    res.render('chat', { // Web Directory **index doesnot required
        title: 'Chat App',
        name: 'Chakron Dechkrut'
    })

})

router.get('/test', (req, res) => {

    res.render('test', { // Web Directory **index doesnot required
        title: 'Websocket Test',
        name: 'Chakron Dechkrut'
    })

})

router.get('*', (req, res) => {

    res.render('404page', {
        title: '404 Page',
    })

})

module.exports = router