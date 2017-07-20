// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  facebookAuth: {
    clientID: '1157167904428122', // your App ID
    clientSecret: 'a476aa0c1264fe486e2a7fb392f83204', // your App Secret
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
  },

  twitterAuth: {
    consumerKey: 'your-consumer-key-here',
    consumerSecret: 'your-client-secret-here',
    callbackURL: 'http://localhost:8080/auth/twitter/callback',
  },

  googleAuth: {
    clientID: 'your-secret-clientID-here',
    clientSecret: 'your-client-secret-here',
    callbackURL: 'http://localhost:8080/auth/google/callback',
  },

};
