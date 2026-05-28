const express = require("express");
const router = express.Router();
const WorkOrder = require("../models/WorkOrder");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const workOrders = await WorkOrder.find(applyCompanyFilter(req))
      .populate("equipment")
      .populate("workCenter")
      .populate("company")
      .populate("assignedTo")
      .populate("assignedTeam")
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
      .populate("equipment")
      .populate("workCenter")
      .populate("company")
      .populate("assignedTo")
      .populate("assignedTeam");
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
    const populated = await WorkOrder.findById(workOrder._id)
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
    const workOrder = await WorkOrder.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, req.body),
      { new: true, runValidators: true },
    )
      .populate("equipment")
      .populate("assignedTo");
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
