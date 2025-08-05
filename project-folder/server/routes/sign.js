const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PDFDocument, rgb } = require('pdf-lib');
const libre = require('libreoffice-convert');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { signature, fileUrl, toEmail } = req.body;
    if (!signature || !fileUrl || !toEmail) {
      return res.status(400).json({ error: 'חסרים פרטים' });
    }

    const fileRes = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const docxBuffer = Buffer.from(fileRes.data);

    // ממירים את Word ל־PDF
    const pdfBuffer = await new Promise((resolve, reject) => {
      libre.convert(docxBuffer, '.pdf', undefined, (err, done) => {
        if (err) return reject(err);
        resolve(done);
      });
    });

    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // מוסיפים עמוד חדש עם חתימה
    const signatureBase64 = signature.replace(/^data:image\/png;base64,/, '');
    const signatureImage = await pdfDoc.embedPng(Buffer.from(signatureBase64, 'base64'));

    const page = pdfDoc.addPage();
    const { width, height } = signatureImage.scale(0.5);
    page.drawImage(signatureImage, {
      x: 50,
      y: 400,
      width,
      height,
    });

    const signedPdf = await pdfDoc.save();
    const signedPath = path.join(__dirname, '../uploads/signed.pdf');
    fs.writeFileSync(signedPath, signedPdf);

    // שליחת מייל
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'מסמך חתום מוכן',
      text: 'המסמך החתום מצורף.',
      attachments: [{ filename: 'signed.pdf', path: signedPath }],
    });

    res.json({ message: 'נשלח בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

module.exports = router;
