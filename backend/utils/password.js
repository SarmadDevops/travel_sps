const bcrypt = require("bcrypt");
require("dotenv").config();

const SALT_ROUNDS = parseInt(process.env.SALT, 10);

if (!SALT_ROUNDS) {
  throw new Error("SALT is not defined or invalid in environment variables");
}

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
