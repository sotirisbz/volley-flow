import TeamSeasonEntry from "../models/TeamSeasonEntry.js";
import Team from "../models/Team.js";
import League from "../models/League.js";
import Season from "../models/Season.js";

// POST /api/team-seasons
// registers a league to a season for a given season
export const assignTeamToLeague = async (req, res, next) => {
  try {
    const { team, league, season } = req.body;

    const [teamExists, leagueExists, seasonExists] = Promise.all([
      Team.findById(team),
      League.findById(league),
      Season.findById(season),
    ]);

    if (!teamExists) {
      res.status(404);
      throw new Error("Team not found");
    }

    if (!leagueExists) {
      res.status(404);
      throw new Error("League not found");
    }

    if (!seasonExists) {
      res.status(404);
      throw new Error("Season not found");
    }

    const entry = await TeamSeasonEntry.create({ team, league, season });
    res.status(201).json(entry);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(
        new Error("This team is already assigned to a league for this season"),
      );
    }
    next(err);
  }
};

// GET /api/team-seasons/team/:teamId
export const getTeamSeasonHistory = async (req, res, next) => {
  try {
    const history = await TeamSeasonEntry.find({ team: req.params.teamId })
      .populate("league", "name country gender tier group")
      .populate("season", "name startDate endDate")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/team-seasons/:id
export const removeTeamSeasonEntry = async (req, res, next) => {
  try {
    const entry = await TeamSeasonEntry.findById(req.params.id);
    if (!entry) {
      res.status(404);
      throw new Error("Team-season entry not found");
    }

    await entry.deleteOne();
    res.json({ message: "Team removed from the league for this season" });
  } catch (err) {
    next(err);
  }
};
