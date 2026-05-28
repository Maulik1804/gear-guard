const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.find(applyCompanyFilter(req))
      .populate("company")
      .populate("location")
      .populate("workCenter")
      .sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Equipment.distinct("category");
    res.json(categories.filter((c) => c));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    )
      .populate("company")
      .populate("location")
      .populate("workCenter");
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return res.status(400).json({ message: "Equipment name is required" });
    }
    const companyId = getCompanyId(req);
    if (companyId && !req.body.company) {
      req.body.company = companyId;
    }
    if (!req.body.equipmentCode) {
      const count = await Equipment.countDocuments();
      req.body.equipmentCode = `EQ-${String(count + 1).padStart(4, "0")}`;
    }
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/categories", async (req, res) => {
  try {
    res.status(201).json({ name: req.body.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, req.body),
      { new: true, runValidators: true },
    )
      .populate("location")
      .populate("workCenter");
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });
    res.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
