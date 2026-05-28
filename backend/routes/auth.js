const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Company = require("../models/Company");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "gearguard-dev-secret-key";

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

// Register
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

      const { name, email, password, role, company, companyName } = req.body;
      const companyId = await resolveCompanyId({ company, companyName });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({
        name,
        email,
        password,
        role,
        company: companyId,
      });
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.company || null,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.status(201).json({
        message: "User registered successfully",
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

// Login
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
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.company || null,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({
        message: "Login successful",
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

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).populate("company");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
