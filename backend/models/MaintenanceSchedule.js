const mongoose = require("mongoose");

const maintenanceScheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Schedule title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: [
        "once",
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "quarterly",
        "yearly",
      ],
      default: "once",
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "in-progress",
        "completed",
        "overdue",
        "cancelled",
        "scrapped",
      ],
      default: "scheduled",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical", "urgent"],
      default: "medium",
    },
    type: {
      type: String,
      enum: [
        "preventive",
        "predictive",
        "corrective",
        "inspection",
        "calibration",
        "emergency",
      ],
      default: "preventive",
    },
    estimatedDuration: {
      type: Number,
      default: 60,
    },
    completedDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    checklist: [
      {
        item: String,
        completed: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

maintenanceScheduleSchema.index({ company: 1, status: 1, scheduledDate: 1 });
maintenanceScheduleSchema.index({ equipment: 1, scheduledDate: 1 });

module.exports = mongoose.model(
  "MaintenanceSchedule",
  maintenanceScheduleSchema,
);
