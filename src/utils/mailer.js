const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmailWithPdf = async ({
  to,
  subject,
  html,
  pdfBuffer,
  filename,
}) => {
  await transporter.sendMail({
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  })
}

module.exports = { sendEmailWithPdf }