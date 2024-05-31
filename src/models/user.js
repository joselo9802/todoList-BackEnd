const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const generateToken = require("../auth/generateToken");
const getUserData = require("../lib/getUserData");
require("dotenv").config();

const userSchema = new Schema({
  names: {
    type: String,
    required: true,
    trim: true,
  },
  lastNames: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  tasksCategories: {
    type: Array
  },
  tasks: {
    type: Array
    }
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (error, hash) => {
      if (error) {
        next(error);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

userSchema.methods.userExists = async (username) => {
  const existence = await model("User").find({ username: username });
  return existence.length > 0;
};

userSchema.methods.passwordCompare = async (password, hash) => {
  const passwordCompare = await bcrypt.compare(password, hash);
  return passwordCompare;
};

userSchema.methods.createAccessToken = async function (user) {
  return generateToken(getUserData(user));
};

module.exports = model("User", userSchema);
