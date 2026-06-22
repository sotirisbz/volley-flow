import GameStats from "../models/GameStats.js";
import Game from "../models/Game.js";

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
      .populate("game", "date status homeTeam awayTeam")
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
      attacksAttempts,
      attacksErrors,
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
      attacksAttempts,
      attacksErrors,
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
