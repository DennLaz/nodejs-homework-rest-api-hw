const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { PERCONAL_MAIL, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  const mail = { ...data, from: PERCONAL_MAIL };
  await sgMail(mail);
  return true;
};

module.exports = sendMail;
