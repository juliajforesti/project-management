const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = model("Project", ProjectSchema);
