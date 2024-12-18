const express = require("express");
const router = express.Router();
const upload = require('./docMulter');
const path = require("path");
const fs = require('fs');
const pdfParser = require('../../service/document/pdfParser');
const hwpParser = require('../../service/document/hwpParser');

// 업로드 실행
router.post("/upload", upload.single("file"), async (req, res) => {
  
    try {
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let pages;

      if (fileExt === ".pdf") {
        pages = await pdfParser.parsePdfToText(filePath);
      } else if (fileExt === ".hwp") {
        pages = await hwpParser.parseHwpToText(filePath);
      } else {
        throw new Error("Unsupported file format");
      }
  
      res.status(200).json({
        message: "success",
        content: pages,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'File Parsing Error' });
    }
    // 업로드된 파일 삭제
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });
  });

module.exports = router;