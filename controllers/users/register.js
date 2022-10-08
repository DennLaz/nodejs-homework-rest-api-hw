const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { User } = require("../../models/user");

const { RequestError, sendMail } = require("../../helpers");

const { BASE_URL } = process.env;

const register = async (req, res) => {
  const { password, email, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    subscription,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Подтвердите свой адрес електронной почты",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Нажмите для подтверждения регистрации</a>`,
  };

  await sendMail(mail);

  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
    verificationToken: result.verificationToken,
  });
};

module.exports = register;
