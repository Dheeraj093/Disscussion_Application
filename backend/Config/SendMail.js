const { generateMailTransporter } = require("../Config/mail");
exports.SendMail = async (to, subject, htmlContent) => {
  try {
    const transporter = generateMailTransporter();

    await transporter.sendMail({
      from: 'verification@reviewApp.com',
      to,
      subject,
      html: htmlContent,
    });

    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email.');
  }
};

