const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authenticate = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];
    const { limit = 20, unread_only = false } = req.query;

    // Build query - only filter by user if valid ObjectId
    const query = {};
    if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      query.user = userId;
    }
    if (unread_only === "true") query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    const result = notifications.map((n) => ({
      id: n._id,
      user_id: n.user,
      title: n.title,
      message: n.message,
      notification_type: n.type,
      is_read: n.isRead,
      reference_type: n.referenceType,
      reference_id: n.referenceId,
      created_at: n.createdAt,
    }));
    res.json(result);
  } catch (error) {
    console.error("Notifications error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];
    const query = userId ? { user: userId, isRead: false } : { isRead: false };
    const count = await Notification.countDocuments(query);
    res.json({ unread_count: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];
    const { title, message, notification_type, reference_type, reference_id } =
      req.body;
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: notification_type || "info",
      referenceType: reference_type,
      referenceId: reference_id,
    });
    res.status(201).json({
      id: notification._id,
      user_id: notification.user,
      title: notification.title,
      message: notification.message,
      notification_type: notification.type,
      is_read: notification.isRead,
      created_at: notification.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ id: notification._id, is_read: notification.isRead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/read-all", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];
    const query = userId ? { user: userId } : {};
    const result = await Notification.updateMany(query, { isRead: true });
    res.json({
      message: `Marked ${result.modifiedCount} notifications as read`,
      count: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
