const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader")
      .populate("company")
      .populate("members.employee")
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("leader")
      .populate("company")
      .populate("members.employee");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const team = await Team.create(req.body);
    const populated = await Team.findById(team._id)
      .populate("leader")
      .populate("company");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("leader")
      .populate("company");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/members", async (req, res) => {
  try {
    const { employee_id } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    const exists = team.members.some(
      (m) => m.employee.toString() === employee_id
    );
    if (exists)
      return res
        .status(400)
        .json({ message: "Employee is already a team member" });
    team.members.push({ employee: employee_id });
    await team.save();
    const updated = await Team.findById(req.params.id)
      .populate("leader")
      .populate("members.employee");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id/members/:memberId", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    team.members = team.members.filter(
      (m) => m._id.toString() !== req.params.memberId
    );
    await team.save();
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
