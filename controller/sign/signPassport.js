const express = require('express');
const passport = require('passport');
const passportRouter = express.Router();
const LocalStrategy = require('passport-local').Strategy;
const signService = require('../../service/sign/signService')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const users = [];


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: '/sign/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    let user
    try {
      user = await signService.findUserById(profile.id);
    } catch {
      return done(null, { isNewUser: true, profile });
    }
    return done(null, user);
  }
));

// Passport 로컬 전략 설정
passport.use(new LocalStrategy({usernameField: 'id', passwordField: 'password'}, async (id, password, done) => {
  try {
    const user = await signService.findUserById(id);
    await signService.correctPasswordOrThrow(password, user.PASSWORD);
    const u = {
        OWNER_CODE: user.OWNER_CODE,
        NAME: user.NAME
    }
    users.push(u);
    return done(null, u); // 로그인된 회원 저장
  } catch {
    return done(null, false, { message: 'user not found' });
  }
}));

// Passport 세션에 사용자 ID 저장
passport.serializeUser((user, done) => {
  done(null, user);
});

// Passport 세션으로부터 사용자 ID로 사용자 복구
passport.deserializeUser((user, done) => {
  if (user.isNewUser === true) {
    user.isNewUser = false
    done(null, null)
    return;
  }
  let re = users.find(u => u.OWNER_CODE === user.OWNER_CODE);
  if (!re) {
    re = user;
  }
  done(null, re);
});

  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}

module.exports = { passportRouter, isLoggedIn, isNotLoggedIn };