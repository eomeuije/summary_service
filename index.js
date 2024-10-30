const express = require('express');
const summaryRouter = require('./controller/summary/summaryController');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');

app.use('/summary', summaryRouter);

app.get('/', async (req, res) => {
    res.render('main');
});

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT)
});