import Team from "../models/Team.js";

// GET /api/teams
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

// GET /api/teams/:id
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
};

// POST /api/teams
export const createTeam = async (req, res, next) => {
  try {
    const { name, city } = req.body;
    const team = await Team.create({ name, city });
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

// PUT /api/teams/:id
export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }
    const { name, city } = req.body;
    team.name = name ?? team.name;
    team.city = city ?? team.city;
    const updated = await team.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/teams/:id
export const deletTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }
    await team.deleteOne();
    res.json({ message: "Team removed" });
  } catch (err) {
    next(err);
  }
};
