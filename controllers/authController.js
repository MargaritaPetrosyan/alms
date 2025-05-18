const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../mailer");
const { styleText } = require("util");

const getLogin = (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  res.render("auth/login", { pageTitle: "Login", footer: "simple" });
};

const postLogin = async (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("errorMessage", "Invalid email or password.");
      return res.redirect("/login");
    }

    if (user.verificationToken) {
      req.flash("errorMessage", "You should verify your email to login.");
      return res.redirect("/login");
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isAuth = true;
      req.session.userId = user._id;
      return req.session.save((err) => {
        if (err) {
          console.error(err);
        }
        return res.redirect("/"); // ✅ redirect to homepage or dashboard
      });
    }

    req.flash("errorMessage", "Invalid email or password.");
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
};

const getRegister = (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  res.render("auth/register", { pageTitle: "Register", footer: "simple" });
};
const postRegister = async (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  const { email, password, fullName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash(
        "errorMessage",
        "E-Mail exists already, please pick a different one."
      );
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(16).toString("hex");

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      verificationToken,
    });

    await newUser.save();
    await sendVerificationEmail(email, fullName, verificationToken);

    // Auto login the user
    req.session.isAuth = true;
    req.session.userId = newUser._id;

    return req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.redirect("/login");
      }
      return res.redirect("/"); // Or wherever your logged-in user homepage is
    });
  } catch (err) {
    console.error(err);
    return res.redirect("/register");
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (user) {
    user.verificationToken = null;
    await user.save();
  }

  res.redirect("/login");
};

const getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
};

const getForgetPassword = (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  res.render("auth/forget-password", {
    pageTitle: "Forget Password",
    footer: "simple",
  });
};

const postForgetPassword = async (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const resetPasswordToken = crypto.randomBytes(16).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    await user.save();

    await sendResetPasswordEmail(user.email, user.fullName, resetPasswordToken);
  }

  return res.redirect("/login");
};

const getResetPassword = async (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  const { token } = req.query;
  const user = await User.findOne({ resetPasswordToken: token });

  if (!user) {
    req.flash("errorMessage", "Invalid reset password url.");
    return res.redirect("/login");
  }

  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    footer: "simple",
    token,
  });
};

const postResetPassword = async (req, res, next) => {
  if (req.isAuth) {
    return res.redirect("/");
  }

  const { password, resetPasswordToken } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken });
    if (!user) {
      req.flash("errorMessage", "Invalid reset password url.");
      return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.verificationToken = null;
    user.resetPasswordToken = null;
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  verifyEmail,
  getForgetPassword,
  postForgetPassword,
  getResetPassword,
  postResetPassword,
  getLogout,
};
