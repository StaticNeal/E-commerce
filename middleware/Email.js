
import { transporter } from "./Email.config.js"
export const SendVerificationCode = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"Eowi" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your code for Eowi',
            text: 'Hey',
            html: Verification_Email_Template.replace('{verificationCode}', verificationCode)
        })
        console.log('Email send Successfully', response);
    } catch (error) {
        console.log('Something went wrong with the Email');
    }
}

export const WelcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: `"Eowi" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Eowi!',
            text: 'Hey',
            html: Welcome_Email_Template.replace('{name}', name)
        })
        console.log('Email send Successfully', response);
    } catch (error) {
        console.log('Something went wrong with the Email');
    }
}

export const SendAccountRecoveryEmail = async (email, recoveryLink) => {
    try {
        const recoveryEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Recovery</title>
</head>
<body style="
  margin:0;
  padding:0;
  background-color:#f4f4f4;
  font-family:sans-serif;
">
  <div style="
    max-width:600px;
    margin:30px auto;
    background-color:#ffffff;
    padding:20px;
    border:1px solid #ddd;
    box-shadow:0 0 10px rgba(0,0,0,0.1);
  ">
    <div style="
      background-color:#ff9800;
      color:#ffffff;
      padding:20px;
      text-align:center;
      font-size:26px;
      font-weight:bold;
    ">
      Account Recovery - 7 Days Left
    </div>

    <div style="
      padding:20px;
      font-size:16px;
      line-height:1.6;
      color:#333;
    ">
      <p style="margin:0 0 15px;">Hello,</p>

      <p style="margin:0 0 15px;">
        Your Eowi account has been marked for deletion. <strong>You have 7 days to recover it</strong>.
      </p>

      <p style="margin:0 0 15px;">
        Click the button below to reactivate your account:
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${recoveryLink}" style="
          display:inline-block;
          background-color:#7c3aed;
          color:#ffffff;
          padding:12px 30px;
          text-decoration:none;
          border-radius:5px;
          font-weight:bold;
          font-size:16px;
        ">
          Recover My Account
        </a>
      </div>

      <p style="margin:0 0 15px;">
        After 7 days, your account and all associated data will be <strong>permanently deleted</strong>.
      </p>

      <p style="margin:0 0 15px;">
        If you did not request this, you can safely ignore this email.
      </p>

      <p style="margin:20px 0 0; color:#666; font-size:14px;">
        Best regards,<br>
        The Eowi Team
      </p>
    </div>

    <div style="
      background-color:#f4f4f4;
      padding:15px;
      text-align:center;
      font-size:12px;
      color:#666;
      border-top:1px solid #ddd;
    ">
      <p style="margin:0;">© 2026 Eowi. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

        const response = await transporter.sendMail({
            from: `"Eowi" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Account Recovery - You have 7 days to reactivate your account',
            text: 'Your account has been marked for deletion. Click the link in this email to recover it within 7 days.',
            html: recoveryEmailTemplate
        })
        console.log('Recovery email sent successfully', response);
    } catch (error) {
        console.error('Error sending recovery email:', error);
    }
}

export const SendAccountDeletionOTP = async (email, deletionCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"Eowi" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Confirm Account Deletion - 6-Digit Code Required',
            text: 'We received a request to delete your account. Enter the 6-digit code to confirm.',
            html: Account_Deletion_OTP_Template.replace('{deletionCode}', deletionCode)
        })
        console.log('Deletion OTP email sent successfully', response);
    } catch (error) {
        console.error('Error sending deletion OTP email:', error);
    }
}


