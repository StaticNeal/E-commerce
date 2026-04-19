import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config() 

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true
})

transporter.verify()
  .then(() => console.log('SMTP connection verified'))
  .catch(err => console.error('SMTP verify failed:', err));

