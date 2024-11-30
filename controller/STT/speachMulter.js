const multer = require("multer");
const path = require("path");
const fs = require("fs");


const getDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const uploadDirectory = path.join(__dirname, '..', '..', "uploads", 'speach', `${year}-${month}-${day}`);
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
  return uploadDirectory;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getDateString());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".mp3", ".aac", ".ac3", ".ogg", ".flac", ".wav", ".m4a"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 1GB 제한
  });

  
module.exports = upload