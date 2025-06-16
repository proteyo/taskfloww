const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["planned", "in_progress", "review", "done"],
      default: "planned",
    },
    solutionText: String, // решение участника
    submitted: { type: Boolean, default: false }, // отправлено ли на проверку
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
