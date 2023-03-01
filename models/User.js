const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: [6, "Password must be atleast 6 characters"],
      maxlength: [1024, "Password cannot excede 1024 characters"],
      select: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: String,
    },
    country: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    bodyImage: [String],
    importance: {
      type: String,
      enum: ["appearance", "personality"],
    },
  },
  {
    timestamps: true,
  }
);

//Encrypting the password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("user", userSchema);
