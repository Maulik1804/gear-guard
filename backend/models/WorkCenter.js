const mongoose = require("mongoose");

const workCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Work center name is required"],
      trim: true,
    },
    workCenterGroup: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkCenter", workCenterSchema);
