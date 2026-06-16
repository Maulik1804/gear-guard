const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(applyCompanyFilter(req))
      .populate({ path: "workOrder", select: "orderNumber title status dueDate" })
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "company", select: "name" })
      .select("title description workOrder equipment assignedTo company status priority type dueDate completedDate estimatedTime actualTime notes createdAt updatedAt")
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
      .populate({ path: "workOrder", select: "orderNumber title status dueDate" })
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "company", select: "name" })
      .select("title description workOrder equipment assignedTo company status priority type dueDate completedDate estimatedTime actualTime notes createdAt updatedAt");
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
    await task.populate([
      { path: "equipment", select: "name equipmentCode status" },
      { path: "assignedTo", select: "name position status" },
    ]);
    res.status(201).json(task);
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
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .select("title description workOrder equipment assignedTo company status priority type dueDate completedDate estimatedTime actualTime notes createdAt updatedAt");
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
