const mongoose = require("mongoose");

const workOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Work order title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
    workCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkCenter",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled", "on-hold"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["preventive", "corrective", "emergency", "inspection"],
      default: "corrective",
    },
    scheduledDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      default: 0,
    },
    actualHours: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

workOrderSchema.index({ company: 1, status: 1, createdAt: -1 });
workOrderSchema.index({ company: 1, dueDate: 1 });

// Auto-generate order number
workOrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const query = this.company ? { company: this.company } : {};
    const count = await this.constructor.countDocuments(query);
    this.orderNumber = `WO-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("WorkOrder", workOrderSchema);
