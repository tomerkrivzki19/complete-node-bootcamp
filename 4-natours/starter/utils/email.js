//    npm i nodemailer -> for sending messages to eamil npm  package
const nodemailer = require('nodemailer');

// options ===> email adress - where we want to send the email to , subjcet lines , email content and mybe another stuff
const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    // options:
    //service: 'Gmail', // one of the services that nodemailer knew how to deal with, another examples is Yahoo,hotmail and many others
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      //authentication:
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" option -must for sending email from your account
    //this is the link : https://mailtrap.io/
    //* we have here the option of "MAILTRAP" - basicly a fakes to send emails to real adresses, but in reality those emails get trap inside development inbox  so we can take a look how it will be later in production
  });

  //2) Define the email options
  const mailOptions = {
    from: 'Jonas Schmedtmann  <hello@jonas.io>', //name + email adress
    to: options.email, //options ->  the actual argumnet
    subject: options.subject,
    text: options.message,
    // html: options.html, //convert this message to html
  };

  //3) Actully send the email
  await transporter.sendMail(mailOptions); // returns us a promise , async function
};

module.exports = sendEmail;
