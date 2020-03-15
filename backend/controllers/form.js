const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
  const { email, name, message } = req.body;
  console.log(req.body);

  const emailData = {
    to: process.env.EMAIL_TO,
    from: email,
    subject: `연락처 - ${process.env.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
            <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>이 메일에는 민감한 정보가 포함되어 있을 수 있습니다.</p>
            <p>https://www.sulog.com</p>
        `
  };

  sgMail.send(emailData).then(sent => {
    return res.json({
      success: true
    });
  });
};

exports.contactBlogAuthorForm = (req, res) => {
  const { authorEmail, email, name, message } = req.body;
  console.log("req.body", req.body);
  let maillist = [authorEmail, process.env.EMAIL_TO];
  console.log(maillist);

  const emailData = {
    to: authorEmail,
    from: email,
    subject: `${process.env.APP_NAME}으로 부터 메세지가 도착했습니다.`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h4>Message received from:</h4>
      <p>name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      <hr />
      <p>이 메일에는 민감한 정보가 포함되어 있을 수 있습니다.</p>
      <p>https://www.sulog.com</p>
  `
  };

  sgMail
    .send(emailData)
    .then(sent => {
      console.log(sent);

      return res.json({
        success: true
      });
    })
    .catch(err => {
      console.log(err);
    });
};
