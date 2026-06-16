const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const authenticate = require("../middleware/auth");
const { applyCompanyFilter, getCompanyId } = require("../utils/companyScope");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find(applyCompanyFilter(req))
      .populate({ path: "leader", select: "name email" })
      .populate({ path: "company", select: "name" })
      .populate({ path: "members.employee", select: "name email" })
      .select("name leader company members status description createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    )
      .populate({ path: "leader", select: "name email" })
      .populate({ path: "company", select: "name" })
      .populate({ path: "members.employee", select: "name email" })
      .select("name leader company members status description createdAt updatedAt");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const team = await Team.create({
      ...req.body,
      company: req.body.company || companyId,
    });
    await team.populate([
      { path: "leader", select: "name email" },
      { path: "company", select: "name" },
    ]);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const team = await Team.findOneAndUpdate(
      applyCompanyFilter(req, { _id: req.params.id }),
      applyCompanyFilter(req, {
        ...req.body,
        company: req.body.company || getCompanyId(req),
      }),
      {
        new: true,
        runValidators: true,
      },
    )
      .populate({ path: "leader", select: "name email" })
      .populate({ path: "company", select: "name" })
      .select("name leader company members status description createdAt updatedAt");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const team = await Team.findOneAndDelete(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/members", async (req, res) => {
  try {
    const { employee_id } = req.body;
    const team = await Team.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    const exists = team.members.some(
      (m) => m.employee.toString() === employee_id,
    );
    if (exists)
      return res
        .status(400)
        .json({ message: "Employee is already a team member" });
    team.members.push({ employee: employee_id });
    await team.save();
    const updated = await Team.findById(req.params.id)
      .populate({ path: "leader", select: "name email" })
      .populate({ path: "members.employee", select: "name email" })
      .select("name leader company members status description createdAt updatedAt");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id/members/:memberId", async (req, res) => {
  try {
    const team = await Team.findOne(
      applyCompanyFilter(req, { _id: req.params.id }),
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    team.members = team.members.filter(
      (m) => m._id.toString() !== req.params.memberId,
    );
    await team.save();
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
