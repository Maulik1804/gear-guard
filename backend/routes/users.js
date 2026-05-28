const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Company = require("../models/Company");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
    return false;
  }

  return true;
};

const resolveCompanyId = async ({ company, companyName }) => {
  if (company) return company;

  const normalizedName =
    typeof companyName === "string" ? companyName.trim() : "";
  if (!normalizedName) return null;

  const existingCompany = await Company.findOne({ name: normalizedName });
  if (existingCompany) return existingCompany._id;

  const createdCompany = await Company.create({ name: normalizedName });
  return createdCompany._id;
};

// @route   POST /api/users/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("companyName")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Company name must be at least 2 characters"),
    body("role").optional().isIn(["admin", "manager", "technician", "user"]),
  ],
  async (req, res) => {
    try {
      if (!validate(req, res)) return;

      const { name, email, password, company, companyName, role } = req.body;
      const companyId = await resolveCompanyId({ company, companyName });
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
      const user = await User.create({
        name,
        email,
        password,
        company: companyId,
        role,
      });
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.company || null,
        },
        process.env.JWT_SECRET || "gearguard-dev-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" },
      );
      res.status(201).json({
        user: await User.findById(user._id)
          .populate("company")
          .select("-password"),
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// @route   POST /api/users/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      if (!validate(req, res)) return;

      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.company || null,
        },
        process.env.JWT_SECRET || "gearguard-dev-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" },
      );
      res.json({
        user: await User.findById(user._id)
          .populate("company")
          .select("-password"),
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// @route   GET /api/users
router.use(authenticate);

const canAccessUser = (req, userId) =>
  req.user?.role === "admin" || req.user?.id === userId;

router.get("/", async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await User.find().populate("company").select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    if (!canAccessUser(req, req.params.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findById(req.params.id)
      .populate("company")
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    if (!canAccessUser(req, req.params.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const {
      name,
      email,
      role,
      company,
      phone,
      job_title,
      timezone,
      notification_settings,
      two_factor_enabled,
      session_timeout,
    } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (job_title !== undefined) updateData.job_title = job_title;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (notification_settings !== undefined)
      updateData.notification_settings = notification_settings;
    if (two_factor_enabled !== undefined)
      updateData.two_factor_enabled = two_factor_enabled;
    if (session_timeout !== undefined)
      updateData.session_timeout = session_timeout;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!canAccessUser(req, req.params.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id/password
router.put("/:id/password", async (req, res) => {
  try {
    if (!canAccessUser(req, req.params.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = new_password;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
