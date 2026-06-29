import GameStats from "../models/GameStats.js";
import Game from "../models/Game.js";
import mongoose from "mongoose";

// GET /api/stats/game/:gameId
export const getStatsByGame = async (req, res, next) => {
  try {
    const stats = await GameStats.find({ game: req.params.gameId })
      .populate("player", "name number position")
      .populate("team", "name");

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// GET /api/stats/player/:playerId
export const getStatsByPlayer = async (req, res, next) => {
  try {
    const stats = await GameStats.find({ player: req.params.playerId })
      .populate("game", "date status homeTeam awayTeam sets")
      .populate("team", "name");

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// POST /api/stats/
export const createStats = async (req, res, next) => {
  try {
    const {
      game,
      player,
      team,
      kills,
      attackAttempts,
      attackErrors,
      aces,
      serveAttempts,
      serveErrors,
      digs,
      receptionErrors,
      blocks,
      blockErrors,
      assists,
    } = req.body;

    const gameExists = await Game.findById(game);
    if (!gameExists) {
      res.status(404);
      throw new Error("Game not found");
    }

    const stats = await GameStats.create({
      game,
      player,
      team,
      kills,
      attackAttempts,
      attackErrors,
      aces,
      serveAttempts,
      serveErrors,
      digs,
      receptionErrors,
      blocks,
      blockErrors,
      assists,
    });

    res.status(201).json(stats);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(
        new Error("Stats for this player in this game already exist"),
      );
    }
    next(err);
  }
};

// PUT /api/stats/:id
export const updateStats = async (req, res, next) => {
  try {
    const stats = await GameStats.findById(req.params.id);
    if (!stats) {
      res.status(404);
      throw new Error("Stats entry not found");
    }

    const fields = [
      "kills",
      "attackAttempts",
      "attackErrors",
      "aces",
      "serveAttempts",
      "serveErrors",
      "digs",
      "receptionErrors",
      "blocks",
      "blockErrors",
      "assists",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) stats[field] = req.body[field];
    });

    const updated = await stats.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/stats/:id
export const deleteStats = async (req, res, next) => {
  try {
    const stats = await GameStats.findById(req.params.id);
    if (!stats) {
      res.status(404);
      throw new Error("Stats entry not found");
    }

    await stats.deleteOne();
    res.json({ message: "Stats entry removed" });
  } catch (err) {
    next(err);
  }
};

// GET /api/stats/player/:palyerId/season
export const getPlayerSeasonStats = async (req, res, next) => {
  try {
    const [agg] = await GameStats.aggregate([
      { $match: { player: new mongoose.Types.ObjectId(req.params.playerId) } },
      {
        $group: {
          _id: "$player",
          gamesPlayed: { $sum: 1 },
          totalKills: { $sum: "$kills" },
          totalAttempts: { $sum: "$attackAttempts" },
          totalAttackErrors: { $sum: "$attackErrors" },
          totalAces: { $sum: "$aces" },
          totalServeAttempts: { $sum: "$serveAttempts" },
          totalServeErrors: { $sum: "$serveErrors" },
          totalDigs: { $sum: "$digs" },
          totalBlocks: { $sum: "$blocks" },
          totalAssists: { $sum: "$assists" },
        },
      },
      {
        $project: {
          gamesPlayed: 1,
          totalKills: 1,
          totalAttempts: 1,
          totalAttackErrors: 1,
          totalAces: 1,
          totalServeAttempts: 1,
          totalServeErrors: 1,
          totalDigs: 1,
          totalBlocks: 1,
          totalAssists: 1,
          avgKills: {
            $round: [{ $divide: ["$totalKills", "$gamesPlayed"] }, 2],
          },
          avgDigs: { $round: [{ $divide: ["$totalDigs", "$gamesPlayed"] }, 2] },
          avgAces: { $round: [{ $divide: ["$totalAces", "$gamesPlayed"] }, 2] },
          avgBlocks: {
            $round: [{ $divide: ["$totalBlocks", "$gamesPlayed"] }, 2],
          },
          avgAssists: {
            $round: [{ $divide: ["$totalAssists", "$gamesPlayed"] }, 2],
          },
          attackPct: {
            $cond: [
              { $eq: ["$totalAttempts", 0] },
              0,
              {
                $round: [
                  {
                    $divide: [
                      { $subtract: ["$totalKills", "$totalAttackErrors"] },
                      "$totalAttempts",
                    ],
                  },
                  3,
                ],
              },
            ],
          },
        },
      },
    ]);
    res.json(agg ?? null);
  } catch (err) {
    next(err);
  }
};
