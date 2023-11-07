const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

const CONFIG = require("../configs/config.google.auth");
require("dotenv").config();

// Passport google
passport.use(
  new GoogleStrategy(
    {
      clientID: CONFIG.auth.google.GOOGLE_CLIENT_ID,
      clientSecret: CONFIG.auth.google.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://${process.env.DEV_APP_HOST}:${process.env.PORT}/auth/google/return_err`,
    },
    function (accessToken, refreshToken, profile, next) {
      console.log(accessToken);
      // try {
      //   if (profile) {
      //     console.log(accessToken);
      //     next(null, profile);
      //   }
      // } catch (error) {
      //   console.log(accessToken, "in error");
      //   next(error);
      // }
    }
  )
);
