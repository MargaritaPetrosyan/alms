const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/forget-password", authController.getForgetPassword);
authRouter.post("/forget-password", authController.postForgetPassword);
authRouter.get("/reset-password", authController.getResetPassword);
authRouter.post("/reset-password", authController.postResetPassword);

authRouter.get("/register", authController.getRegister);
authRouter.post("/register", authController.postRegister);
authRouter.get("/verify-email", authController.verifyEmail);

authRouter.get("/logout", authController.getLogout);

module.exports = authRouter;
