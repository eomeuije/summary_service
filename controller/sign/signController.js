const express = require("express");
const router = express.Router();
const passport = require('passport');
const signService = require('../../service/sign/signService');
const { isLoggedIn, isNotLoggedIn } = require("./signPassport");

router.get('/in', isNotLoggedIn, async (req, res) => {
    res.render('sign/in');
  });

router.post('/in', isNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign/in?error=1', // 로그인 실패 시 이동할 경로
}), (req, res) => {
  res.send('Login successful');
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    if (req.user.isNewUser) {
      req.session.newUser = req.user;
      res.render('sign/auth/up', { name: req.user.profile.displayName });
    } else {
      res.redirect('/');
    }
  }
);

router.post('/auth/up', async (req, res) => {
  const { name } = req.body;
  const id = req.session.newUser.profile.id;
  let user;
  try {
    await signService.signupAuth(id, name);
    user = await signService.findUserById(id);
  } catch (error) {
    console.log(error);
  }
  delete req.session.newUser;
  req.login(user, (err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
});
});

router.get('/up', isNotLoggedIn, (req, res) => {
  res.render('sign/up');
});

router.post('/up', isNotLoggedIn, async (req, res) => {
  try {
    const user = req.body;
    await signService.signup(user.id, user.name, user.password);
    res.redirect('/sign/in');
  } catch {
    res.redirect('/sign/up?error=1');
  }
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      res.send('success');
    }
  });
});

module.exports = router; 