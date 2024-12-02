const express = require("express");
const router = express.Router();
const upload = require('./speachMulter');
const speachService = require('../../service/STT/speachService');

router.post("/upload", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;
  
    try {
      let speachText = await speachService.convert_speech_to_text(filePath);
      
      res.status(200).json({
        message: "File parsed successfully",
        content: speachText.trim(),
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'File Error' });
    }
    // 업로드된 파일 삭제
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });
  });

module.exports = router;