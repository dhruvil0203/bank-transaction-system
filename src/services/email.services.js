import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend banking" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterEmail(userEmail,name){
    const subject = "Welcome to Backend Banking";
    const text = "Thank you for registering with Backend Banking";
    const html = `<p>Dear ${name},</p>
    <p>Thank you for registering with Backend Banking.</p>
    <p>Best regards,<br>Backend Banking</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendcreateAccountEmail(userEmail,name){
    const subject = "Account Created Successfully";
    const text = "Your account has been created successfully";
    const html = `<p>Dear ${name},</p>
    <p>Your account has been created successfully.</p>
    <p>Best regards,<br>Backend Banking</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail,name,amount,type){
    const subject = "Transaction Successful";
    const text = "Your transaction has been completed successfully";
    const html = `<p>Dear ${name},</p>
    <p>Your transaction of ${amount} has been completed successfully.</p>
    <p>Best regards,<br>Backend Banking</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailEmail(userEmail,name,amount,type){
    const subject = "Transaction Failed";
    const text = "Your transaction has failed";
    const html = `<p>Dear ${name},</p>
    <p>Your transaction of ${amount} has failed.</p>
    <p>Best regards,<br>Backend Banking</p>`;
    await sendEmail(userEmail, subject, text, html);
}


export default {
    transporter,
    sendEmail,
    sendRegisterEmail,
    sendcreateAccountEmail,
    sendTransactionEmail,
    sendTransactionFailEmail
}