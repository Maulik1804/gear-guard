const express = require("express");
const router = express.Router();
const MaintenanceSchedule = require("../models/MaintenanceSchedule");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find(applyCompanyFilter(req))
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "assignedTeam", select: "name status" })
      .populate({ path: "company", select: "name" })
      .select("title description equipment assignedTo assignedTeam company scheduledDate frequency status priority type estimatedDuration completedDate notes checklist createdAt updatedAt")
      .sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = applyCompanyFilter(req, {});
    if (start && end)
      query.scheduledDate = { $gte: new Date(start), $lte: new Date(end) };
    const schedules = await MaintenanceSchedule.find(query)
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    )
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "assignedTeam", select: "name status" })
      .populate({ path: "company", select: "name" })
      .select("title description equipment assignedTo assignedTeam company scheduledDate frequency status priority type estimatedDuration completedDate notes checklist createdAt updatedAt");
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
    const companyId = getCompanyId(req);
    const schedule = await MaintenanceSchedule.create({
      ...req.body,
      company: req.body.company || companyId,
    });
    await schedule.populate([
      { path: "equipment", select: "name equipmentCode status" },
      { path: "assignedTo", select: "name position status" },
    ]);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.status === "completed" && !req.body.completedDate)
      req.body.completedDate = new Date();
    const schedule = await MaintenanceSchedule.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, req.body),
      { new: true, runValidators: true },
    )
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .select("title description equipment assignedTo assignedTeam company scheduledDate frequency status priority type estimatedDuration completedDate notes checklist createdAt updatedAt");
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
    const schedule = await MaintenanceSchedule.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
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
