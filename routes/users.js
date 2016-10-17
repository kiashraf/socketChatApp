/**
 * Created by user on 08-08-2016.
 */
var express = require('express');
var router = express.Router();
var config = require('../config/database');

/* GET users listing. */

router.get('/', isLoggedIn, function (req, res, next) {
    var connectedUsers = require('../app').chatUsers;
    var roomId = require('../config/socket').roomId;

    if (req.isAuthenticated()) {

        res.render('users', {
            currentUser: req.user,

            locals: {currentUserId: req.user._id},
            roomId: roomId,
            users: connectedUsers,
            title: 'OnLineUsers',
            host : config.host

        });
    }
});


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
