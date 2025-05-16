const Config = require("./config");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

let mailer = nodemailer.createTransport(Config.mailtrapOptions);

async function sendVerificationEmail(toEmail, fullName, verificationToken) {
  const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

  const templatePath = path.join(
    __dirname,
    "views/auth/verification-email.ejs"
  );

  const htmlContent = await ejs.renderFile(templatePath, {
    fullName,
    verificationUrl,
  });

  const mailOptions = {
    from: '"ALMS Support" <support@alms.com>',
    to: toEmail,
    subject: "Please verify your email address",
    html: htmlContent,
  };

  const info = await mailer.sendMail(mailOptions);
}

async function sendResetPasswordEmail(toEmail, fullName, resetPasswordToken) {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetPasswordToken}`;

  const templatePath = path.join(
    __dirname,
    "views/auth/reset-password-email.ejs"
  );

  const htmlContent = await ejs.renderFile(templatePath, {
    fullName,
    resetUrl,
  });

  const mailOptions = {
    from: '"ALMS Support" <support@alms.com>',
    to: toEmail,
    subject: "Reset password",
    html: htmlContent,
  };

  const info = await mailer.sendMail(mailOptions);
}

module.exports = { mailer, sendVerificationEmail, sendResetPasswordEmail };
