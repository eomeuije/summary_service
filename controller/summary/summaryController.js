const express = require("express");
const router = express.Router();
const summaryService = require('../../service/summary/summaryService');

router.post('/', async (req, res) => {
    const { content } = req.body;
    let summary;
    try {
        summary = await summaryService.summarize(content);
    } catch (error) {
        console.error(error);
    }
    res.json({ summary });
});

module.exports = router;