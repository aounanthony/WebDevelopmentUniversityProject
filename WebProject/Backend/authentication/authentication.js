const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/UserModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


passport.use('register', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
    try {
      const user = await UserModel.create({ username, password });
      return done(null, user);
    } catch (error) {
      done(null, error);
    }
}));


passport.use('login', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
  try {
    const user = await UserModel.findOne({ username });
    if( !user ){
      return done(null, false, { message : 'Incorrect Username!'});
    }
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Incorrect Password!'});
    }
    return done(null, user, { message : 'Logged in Successfully!'});
  } catch (error) {
    return done(error);
  }
}));



passport.use(new JWTstrategy({
  secretOrKey : 'Password_Strong',
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),

}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));