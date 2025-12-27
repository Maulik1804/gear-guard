const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email")
      .populate("company")
      .sort({ createdAt: -1 });
    const result = employees.map((emp) => ({
      id: emp._id,
      _id: emp._id,
      name: emp.user?.name || "",
      email: emp.user?.email || "",
      employeeCode: emp.employeeCode,
      department: emp.department,
      position: emp.position,
      phone: emp.phone,
      status: emp.status,
      location: emp.location,
      company: emp.company,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "name email")
      .populate("company");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json({
      id: employee._id,
      _id: employee._id,
      name: employee.user?.name || "",
      email: employee.user?.email || "",
      employeeCode: employee.employeeCode,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      status: employee.status,
      location: employee.location,
      company: employee.company,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      position,
      phone,
      status,
      location,
      company,
    } = req.body;
    const user = await User.create({
      name,
      email,
      password: password || "defaultPassword123",
      company,
      role: "user",
    });
    const count = await Employee.countDocuments();
    const employee = await Employee.create({
      user: user._id,
      employeeCode: `EMP-${String(count + 1).padStart(4, "0")}`,
      company,
      department,
      position,
      phone,
      status,
      location,
    });
    res.status(201).json({
      id: employee._id,
      _id: employee._id,
      name,
      email,
      employeeCode: employee.employeeCode,
      department,
      position,
      phone,
      status,
      location,
      company,
      createdAt: employee.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, department, position, phone, status, location } =
      req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    if (employee.user && (name || email))
      await User.findByIdAndUpdate(employee.user, { name, email });
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { department, position, phone, status, location },
      { new: true, runValidators: true }
    ).populate("user", "name email");
    res.json({
      id: updated._id,
      _id: updated._id,
      name: updated.user?.name || name,
      email: updated.user?.email || email,
      employeeCode: updated.employeeCode,
      department: updated.department,
      position: updated.position,
      phone: updated.phone,
      status: updated.status,
      location: updated.location,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    if (employee.user) await User.findByIdAndDelete(employee.user);
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
