const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrder",
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    type: {
      type: String,
      enum: [
        "inspection",
        "repair",
        "replacement",
        "cleaning",
        "calibration",
        "other",
      ],
      default: "other",
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    estimatedTime: {
      type: Number,
      default: 0,
    },
    actualTime: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ company: 1, status: 1, createdAt: -1 });
taskSchema.index({ company: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
