const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    job_title: {
      type: String,
      trim: true,
      default: "",
    },
    timezone: {
      type: String,
      default: "America/New_York",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    role: {
      type: String,
      enum: ["admin", "manager", "technician", "user"],
      default: "user",
    },
    notification_settings: {
      email_work_orders: { type: Boolean, default: true },
      email_tasks: { type: Boolean, default: true },
      email_maintenance: { type: Boolean, default: true },
      email_reports: { type: Boolean, default: false },
      push_work_orders: { type: Boolean, default: true },
      push_tasks: { type: Boolean, default: true },
      push_maintenance: { type: Boolean, default: true },
    },
    two_factor_enabled: {
      type: Boolean,
      default: false,
    },
    session_timeout: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
