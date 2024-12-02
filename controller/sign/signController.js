const express = require("express");
const router = express.Router();
const passport = require('passport');
const signService = require('../../service/sign/signService');
const { isLoggedIn, isNotLoggedIn, users } = require("./signPassport");

router.get('/in', isNotLoggedIn, async (req, res) => {
  res.render('sign/in');
});

router.post('/in', isNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign/in?error=1', // 로그인 실패 시 이동할 경로
}), (req, res) => {
  res.send('Login successful');
});

// 구글 로그인
router.get('/google', isNotLoggedIn,
  passport.authenticate('google', { scope: ['profile'] })
);

// 구글 로그인 성공시
router.get('/google/callback', isNotLoggedIn,
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인시 회원이 아니면 OAUTH2 회원가입 화면으로 이동
    if (req.user.isNewUser) {
      req.session.newUser = req.user;
      res.render('sign/auth/up', { name: req.user.profile.displayName });
    } else {
      res.redirect('/');
    }
  }
);

// OAUTH2 회원가입
router.post('/auth/up', isNotLoggedIn, async (req, res) => {
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
  const o = req.user.OWNER_CODE
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      const index = users.findIndex(item => o === item.OWNER_CODE);
      if (index !== -1) {
        users.splice(index, 1); // 해당 인덱스의 객체 제거
      }
      res.send('success');
    }
  });
});

module.exports = router; 