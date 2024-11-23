const express = require('express');
require('dotenv').config();
const summaryRouter = require('./controller/summary/summaryController');
const documentRouter = require('./controller/document/documentController');
const speechController = require('./controller/STT/speachController');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');

// 라우터 설정
app.use('/summary', summaryRouter);
app.use('/document', documentRouter);
app.use('/speach', speechController);

// 메인 페이지
app.get('/', (req, res) => {
    res.render('main');
});

// 문서 업로드 페이지
app.get('/doc-upload', (req, res) => {
    res.render('summary/docUpload'); // summary 폴더의 docUpload.ejs 렌더링
});

// 음성 업로드 페이지
app.get('/voice-upload', (req, res) => {
    res.render('summary/voice'); // summary 폴더의 voice.ejs 렌더링
});

// 텍스트 업로드 페이지
app.get('/summary-page', (req, res) => {
    res.render('summary/summary'); // summary 폴더의 summary.ejs 렌더링
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
