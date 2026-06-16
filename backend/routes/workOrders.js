const express = require("express");
const router = express.Router();
const WorkOrder = require("../models/WorkOrder");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const workOrders = await WorkOrder.find(applyCompanyFilter(req))
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "workCenter", select: "name status" })
      .populate({ path: "company", select: "name" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "assignedTeam", select: "name status" })
      .select("orderNumber title description equipment workCenter company assignedTo assignedTeam priority status type scheduledDate dueDate completedDate estimatedHours actualHours cost createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    )
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "workCenter", select: "name status" })
      .populate({ path: "company", select: "name" })
      .populate({ path: "assignedTo", select: "name position status" })
      .populate({ path: "assignedTeam", select: "name status" })
      .select("orderNumber title description equipment workCenter company assignedTo assignedTeam priority status type scheduledDate dueDate completedDate estimatedHours actualHours cost createdAt updatedAt");
    if (!workOrder)
      return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const workOrder = await WorkOrder.create({
      ...req.body,
      company: req.body.company || companyId,
    });
    await workOrder.populate([
      { path: "equipment", select: "name equipmentCode status" },
      { path: "assignedTo", select: "name position status" },
    ]);
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.status === "completed" && !req.body.completedDate)
      req.body.completedDate = new Date();
    const workOrder = await WorkOrder.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, req.body),
      { new: true, runValidators: true },
    )
      .populate({ path: "equipment", select: "name equipmentCode status" })
      .populate({ path: "assignedTo", select: "name position status" })
      .select("orderNumber title description equipment workCenter company assignedTo assignedTeam priority status type scheduledDate dueDate completedDate estimatedHours actualHours cost createdAt updatedAt");
    if (!workOrder)
      return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!workOrder)
      return res.status(404).json({ message: "Work order not found" });
    res.json({ message: "Work order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
