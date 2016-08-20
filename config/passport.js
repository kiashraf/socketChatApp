/**
 * Created by user on 06-08-2016.
 */
/**
 * Created by user on 24-07-2016.
 */
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;

var User = require('../models/user');

module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });


    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'mobile',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, userName, password, done) {
            process.nextTick(function () {
                User.findOne({'mobile': userName}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {

                        return done(null, false, req.flash('signupMessage', 'Already registered with that Number'));
                    } else {

                        var newUser = User();
                        newUser.mobile = userName;
                        newUser.password = newUser.generateHash(password);
                        newUser.confirmPassword = newUser.generateHash(req.body.password2);
                        newUser.name = req.body.name;


                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            require('../app').chatUsers.push(newUser);
                            return done(null, newUser);
                        });


                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'mobile',
            passwordField: 'password',
            passReqToCallback: true

        },
        function (req, userName, password, done) {

            User.findOne({'mobile': userName}, function (err, user) {

                if (err) {
                    return done(err);
                }
                else if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No User Found'));
                }
                else if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password'));
                } else {
                    require('../app').chatUsers.push(user);


                    return done(null, user);
                }
            });


        }));


}