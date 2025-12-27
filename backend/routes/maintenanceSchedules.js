const express = require("express");
const router = express.Router();
const MaintenanceSchedule = require("../models/MaintenanceSchedule");

router.get("/", async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find()
      .populate("equipment")
      .populate("assignedTo")
      .populate("assignedTeam")
      .populate("company")
      .sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = {};
    if (start && end)
      query.scheduledDate = { $gte: new Date(start), $lte: new Date(end) };
    const schedules = await MaintenanceSchedule.find(query)
      .populate("equipment")
      .populate("assignedTo")
      .sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findById(req.params.id)
      .populate("equipment")
      .populate("assignedTo")
      .populate("assignedTeam")
      .populate("company");
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Maintenance schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.create(req.body);
    const populated = await MaintenanceSchedule.findById(schedule._id)
      .populate("equipment")
      .populate("assignedTo");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.status === "completed" && !req.body.completedDate)
      req.body.completedDate = new Date();
    const schedule = await MaintenanceSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("equipment")
      .populate("assignedTo");
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Maintenance schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByIdAndDelete(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ message: "Maintenance schedule not found" });
    res.json({ message: "Maintenance schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
