// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const configAuth = require('./config/auth');


// load up the user model
const User = require('./models/users');

const Person = require('./models/person');


// expose this function to our app using module.exports
module.exports = function auth(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    (req, username, password, done) => {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(() => {
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.find({
          username,
        })
          .then((users) => {
            const user = users[0];
            // check to see if theres already a user with that username
            if (user) {
              return done(null, false, req.flash('signupMessage',
                'Ya existe un usuario con ese nombre de usuario.'));
            }
            // if there is no user with that username
            // create the user
            User.new().then((newUser) => {
              // set the user's local credentials
              newUser = req.body;
              delete newUser.id;
              newUser.email_verified = false;
              // save the user
              User.save(newUser).then((user) => {
                return done(null, user);
              }).catch((err) => {
                if (err) {
                  return done(req.flash('signupMessage', err));
                }
              });
            }).catch((err) => {
              // if there are any errors, return the error
              if (err) {
                return done(err);
              }
            });
          }).catch((err) => {
            return done(err);
          });
      });
    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    (req, username, password, done) => {
      // callback with username and password from our form
      // find a user whose username is the same as the forms username
      // we are checking to see if the user trying to login already exists
      User.find({
        username,
      }).then((users) => {
        const user = users[0];
        // if no user is found, return the message

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'Usuario no existe.')); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is not active notify that
        if (!user.is_active) {
          return done(null, false, req.flash('loginMessage', 'Usuario no se encuentra activo. Para activarlo contacte a Accionet')); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (!User.validPassword(user, password)) {
          return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.')); // create the loginMessage and save it to session as flashdata
        }
        // all is well, return successful user
        return done(null, user);
      }).catch((err) => {
        return done(err);
      });
    }));


  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,

  },

    // facebook will send back the token and profile
    (token, refreshToken, profile, done) => {
      // asynchronous
      process.nextTick(() => {
        // find the user in the database based on their facebook id
        User.findByFBId(profile.id, (err, user) => {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) {
            return done(err);
          }
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          }
          // if there is no user found with that facebook id, create them
          const newUser = new User();
          // set all of the facebook information in our user model
          newUser.facebook.id = profile.id; // set the users facebook id
          // we will save the token that facebook provides to the user
          newUser.facebook.token = token;
          newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`; // look at the passport user profile to see how names are returned
          // facebook can return multiple emails so we'll take the first
          if (profile.emails) {
            newUser.facebook.email = profile.emails[0].value;
          }

          // save our user to the database
          newUser.save((err) => {
            if (err) {
              throw err;
            }
            // if successful, return the new user
            return done(null, newUser);
          });
        });
      });
    }));
};
