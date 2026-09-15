import Player from "../models/Player.js";
import Team from "../models/Team.js";
import Season from "../models/Season.js";
import PlayerSeasonEntry from "../models/PlayerSeasonEntry.js";

// POST /api/player-seasons
export const assignPlayerToTeam = async (req, res, next) => {
  try {
    const { player, team, season } = req.body;

    const [playerDoc, teamExists, seasonDoc] = await Promise.all([
      Player.findById(player),
      Team.findById(team),
      Season.findById(season),
    ]);

    if (!playerDoc) {
      res.satus(404);
      throw new Error("Player not found");
    }
    if (!teamExists) {
      res.satus(404);
      throw new Error("Team not found");
    }
    if (!seasonDoc) {
      res.satus(404);
      throw new Error("Season not found");
    }

    const entry = await PlayerSeasonEntry.create({ player, team, season });

    const history = await PlayerSeasonEntry.find({ player }).populate(
      "season",
      "startDate",
    );
    const isMostRecent = history
      .filter((h) => h.season)
      .every(
        (h) => new Date(seasonDoc.startDate) >= new Date(h.season.startDate),
      );

    if (isMostRecent) {
      playerDoc.team = team;
      await playerDoc.save();
    }

    res.status(201).json(entry);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(
        new Error(
          "This player is already registered to a team for this season",
        ),
      );
    }
    next(err);
  }
};

// GET /api/player-seasons/player/:playerId
export const getPlayerSeasonHistory = async (req, res, next) => {
  try {
    const history = await PlayerSeasonEntry.find({
      player: req.params.playerId,
    })
      .populate("team", "name city")
      .populate("season", "name startDate endDate")
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

// GET /api/player-seasons/team/:teamId?season=<seasonId>
export const getTeamSeasonRoster = async (req, res, next) => {
  try {
    const season = req.query;
    if (!season) {
      res.status(404);
      throw new Error("A season query parameter is required");
    }

    const entries = await PlayerSeasonEntry.find({
      team: req.params.id,
      season,
    }).populate("player", "name number position");

    res.json(entries.map((entry) => entry.player));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/player-seasons/:id
export const removePlayerSeasonEntry = async (req, res, next) => {
  try {
    const entry = await PlayerSeasonEntry.findById(req.params.id);
    if (!entry) {
      res.status(404);
      throw new Error("Player-season entry not found");
    }
    await entry.deleteOne();
    res.json({ message: "Player removed from team for this season" });
  } catch (err) {
    next(err);
  }
};
