// server/controllers/authController.js

// config/passport.js

// load dependencies
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/users');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(finalId, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    // Student Login
    passport.use('user-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                'email': email
            }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('studentRegisterMessage', 'Credenciales inválidas'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('studentRegisterMessage', 'Credenciales inválidas'));

                return done(null, user);
            });
        }));
};
