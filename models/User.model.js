const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: String,
    name: String,
    passwordHash: String,
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
