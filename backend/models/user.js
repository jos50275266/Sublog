const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// username을 기반으로 DB Queries 작성 => index:true
// username을 기반으로 user profile system에 update 작업, unique:true, /api/:username

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      required: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    about: {
      type: String
    },
    role: {
      type: Number,
      trim: true
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ""
    }
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    // create a temporarily variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  makeSalt: function() {
    return Math.round(new Date().valueOf * Math.random()) + "";
  },
  encryptPassword: function(password) {
    if (!password) {
      return "";
    }

    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function(plainPassword) {
    // We will get either true or false!
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
  generateAuthToken: function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    return token;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
