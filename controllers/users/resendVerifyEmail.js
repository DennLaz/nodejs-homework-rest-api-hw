const { User } = require("../../models/user");

const { RequestError, sendMail } = require("../../helpers");

const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw RequestError(404, "Not found");
  }
  if (user.verify) {
    throw RequestError(400, "Verification has already been passed");
  }

  const mail = {
    to: email,
    subject: "Подтвердите свой адрес електронной почты",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Нажмите для подтверждения регистрации</a>`,
  };
  await sendMail(mail);
  res.json({
    message: "Verification email sent",
  });
};

module.exports = resendVerifyEmail;
