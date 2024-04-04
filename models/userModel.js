const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please tell us your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please comfirm your password"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
