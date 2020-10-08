const { Schema, model } = require("mongoose");

const TaskSchema = new Schema(
  {
    title: String,
    description: String,
    status: { type: String, enum: ["To Do", "In Progress", "Done"] },
    attachmentUrl: String,
  },
  { timestamps: true }
);

module.exports = model("Task", TaskSchema);
