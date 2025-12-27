const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
    },
    equipmentCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
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
    workCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkCenter",
    },
    status: {
      type: String,
      enum: ["operational", "maintenance", "repair", "offline", "scrapped"],
      default: "operational",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpiry: {
      type: Date,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
