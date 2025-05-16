const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", schema);
