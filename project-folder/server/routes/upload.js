const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ link: fileUrl });
});

module.exports = router;
