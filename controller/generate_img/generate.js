const express = require("express");
const router = express.Router();
const generateImageService = null;

router.get('/', async (req, res) => {
    res.render('summary/summary');
});

router.post('/', async (req, res) => {
    //대충 이미지생성
});

module.exports = router;