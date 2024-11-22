const express = require('express');
require('dotenv').config();
const summaryRouter = require('./controller/summary/summaryController');
const documnetRouter = require('./controller/document/documentController');
const speachController = require('./controller/STT/speachController');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');

app.use('/summary', summaryRouter);
app.use('/document', documnetRouter);
app.use('/speach', speachController);

app.get('/', async (req, res) => {
    res.render('main');
});

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT)
});