const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(applyCompanyFilter(req))
      .populate("workOrder")
      .populate("equipment")
      .populate("assignedTo")
      .populate("company")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/types", async (req, res) => {
  try {
    res.json([
      "inspection",
      "repair",
      "replacement",
      "cleaning",
      "calibration",
      "other",
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    )
      .populate("workOrder")
      .populate("equipment")
      .populate("assignedTo")
      .populate("company");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const task = await Task.create({
      ...req.body,
      company: req.body.company || companyId,
    });
    const populated = await Task.findById(task._id)
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
    const task = await Task.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, {
        ...req.body,
        company: req.body.company || getCompanyId(req),
      }),
      { new: true, runValidators: true },
    )
      .populate("equipment")
      .populate("assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
