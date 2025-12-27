const express = require("express");
const router = express.Router();
const WorkCenter = require("../models/WorkCenter");

router.get("/", async (req, res) => {
  try {
    const workCenters = await WorkCenter.find()
      .populate("company")
      .populate("location")
      .sort({ createdAt: -1 });
    res.json(workCenters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const workCenter = await WorkCenter.findById(req.params.id)
      .populate("company")
      .populate("location");
    if (!workCenter)
      return res.status(404).json({ message: "Work center not found" });
    res.json(workCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const workCenter = await WorkCenter.create(req.body);
    res.status(201).json(workCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const workCenter = await WorkCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!workCenter)
      return res.status(404).json({ message: "Work center not found" });
    res.json(workCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workCenter = await WorkCenter.findByIdAndDelete(req.params.id);
    if (!workCenter)
      return res.status(404).json({ message: "Work center not found" });
    res.json({ message: "Work center deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
