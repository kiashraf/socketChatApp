var express = require('express');
var router = express.Router();
var config = require('../config/database');
var User = require('../models/user');
router.get('/', isLoggedIn, function (req, res) {

    var connectedUsers = require('../app').chatUsers;

    var UserId = 1234567;

    res.render('socket', {

        locals: {currentUserId: req.user._id},

        PORT : config.PORT,

        to: UserId,
        currentUser: req.user,

        toUserName: 'Alone',
        users: connectedUsers,
        title: 'OnLineUsers'

    })

});

router.get('/:id', isLoggedIn, function (req, res) {

    var connectedUsers = require('../app').chatUsers;
    var UserId = req.params.id;

    var toUser = '';
    if (UserId.length ===24) {
        var query = User.findById(UserId);

        toUser = query.exec(function (err, user) {
            if (err) {
                throw err;
            }
            else {
                return user;
            }
        });


        res.render('socket', {
            to: UserId,
            toUserName: toUser.name,
            title: 'Chat ',
            users: connectedUsers,
            currentUser: req.user,
            PORT : config.PORT
        });


    } else {
        res.redirect('/');
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
