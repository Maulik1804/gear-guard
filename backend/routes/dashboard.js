const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Equipment = require("../models/Equipment");
const WorkOrder = require("../models/WorkOrder");
const Task = require("../models/Task");
const MaintenanceSchedule = require("../models/MaintenanceSchedule");
const { applyCompanyFilter } = require("../utils/companyScope");

router.use(authenticate);

const startOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

router.get("/summary", async (req, res) => {
  try {
    const companyFilter = applyCompanyFilter(req);
    const now = new Date();
    const today = startOfDay();

    const [
      totalEquipment,
      activeWorkOrders,
      pendingTasks,
      scheduledMaintenance,
      completedToday,
      overdueItems,
      recentWorkOrders,
      upcomingMaintenance,
      recentTasks,
    ] = await Promise.all([
      Equipment.countDocuments(companyFilter),
      WorkOrder.countDocuments({ ...companyFilter, status: "in-progress" }),
      Task.countDocuments({ ...companyFilter, status: "pending" }),
      MaintenanceSchedule.countDocuments({ ...companyFilter, status: "scheduled" }),
      WorkOrder.countDocuments({
        ...companyFilter,
        status: "completed",
        updatedAt: { $gte: today },
      }),
      MaintenanceSchedule.countDocuments({
        ...companyFilter,
        status: { $ne: "completed" },
        scheduledDate: { $lt: now },
      }),
      WorkOrder.find(companyFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber status priority updatedAt equipment assignedTo")
        .populate("equipment", "name")
        .populate("assignedTo", "name")
        .lean(),
      MaintenanceSchedule.find({
        ...companyFilter,
        scheduledDate: { $gte: now },
      })
        .sort({ scheduledDate: 1 })
        .limit(4)
        .select("scheduledDate type status equipment assignedTo")
        .populate("equipment", "name")
        .populate("assignedTo", "name")
        .lean(),
      Task.find(companyFilter)
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title status updatedAt assignedTo")
        .populate("assignedTo", "name")
        .lean(),
    ]);

    res.json({
      stats: {
        totalEquipment,
        activeWorkOrders,
        pendingTasks,
        scheduledMaintenance,
        completedToday,
        overdueItems,
      },
      recentWorkOrders: recentWorkOrders.map((workOrder) => ({
        id: workOrder._id,
        number: workOrder.orderNumber || `WO-${workOrder._id?.toString().slice(-6)}`,
        equipment: workOrder.equipment?.name || "Unknown Equipment",
        status: workOrder.status || "draft",
        priority: workOrder.priority || "medium",
        assignee: workOrder.assignedTo?.name || "Unassigned",
      })),
      upcomingMaintenance: upcomingMaintenance.map((schedule) => ({
        id: schedule._id,
        equipment: schedule.equipment?.name || "Unknown Equipment",
        type: schedule.type || "Preventive",
        date: schedule.scheduledDate,
        status: schedule.status,
        assignee: schedule.assignedTo?.name || "Unassigned",
      })),
      recentTasks: recentTasks.map((task) => ({
        id: task._id,
        title: task.title || "Unnamed",
        status: task.status || "pending",
        user: task.assignedTo?.name || "System",
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;