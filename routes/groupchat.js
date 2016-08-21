/**
 * Created by user on 21-08-2016.
 */
var express = require('express');
var router = express.Router();


router.get('/', isLoggedIn, function (req, res) {


    res.render('groupchat', {


        title: 'Chat ',

        currentUser: req.user
    });


});
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
