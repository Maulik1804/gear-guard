const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find(applyCompanyFilter(req))
      .populate("company")
      .sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    ).populate("company");
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const location = await Location.create({
      ...req.body,
      company: req.body.company || companyId,
    });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, req.body),
      {
        new: true,
        runValidators: true,
      },
    );
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const location = await Location.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
