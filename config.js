require("dotenv").config();

const Config = {
  port: process.env.PORT ?? 3000,
  sessionSecret: process.env.SESSION_SECRET ?? "abc123",
  mongodbUrl:
    process.env.MONGODB_URL ??
    "mongodb+srv://mPetrosyan:093481068Aa.a@cluster0.d1hfspe.mongodb.net/alms?retryWrites=true&w=majority&appName=Cluster0",
  mailtrapOptions: {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  },
};

module.exports = Config;
