require('dotenv').config();
const express = require('express');
const session = require('express-session');
const summaryRouter = require('./controller/summary/summaryController');
const documentRouter = require('./controller/document/documentController');
const speechController = require('./controller/STT/speachController');
const passport = require('passport');
const signRouter = require('./controller/sign/signController');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// 라우터 설정
app.use('/summary', summaryRouter);
app.use('/document', documentRouter);
app.use('/speach', speechController);
app.use('/sign', signRouter);

// 메인 페이지
app.get('/', async (req, res) => {
    res.render('main', { user: req.user });
});

// 문서 업로드 페이지
app.get('/doc-upload', (req, res) => {
    res.render('summary/docUpload', { user: req.user }); // summary 폴더의 docUpload.ejs 렌더링
});

// 음성 업로드 페이지
app.get('/voice-upload', (req, res) => {
    const user = req.user;
    if (user && user.MEMBERSHIP_TIER > 0) {
        res.render('summary/voice', { user }); // summary 폴더의 voice.ejs 렌더링        
    } else {
        res.redirect('/');
    }
});

// 텍스트 업로드 페이지
app.get('/summary-page', (req, res) => {
    res.render('summary/summary', { user: req.user }); // summary 폴더의 summary.ejs 렌더링
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
