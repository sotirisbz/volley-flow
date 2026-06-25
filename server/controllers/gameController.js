import Game from "../models/Game.js";

// GET /api/games
export const getGames = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.team) {
      filter.$or = [{ homeTeam: req.query.team }, { awayTeam: req.query.team }];
    }

    const games = await Game.find(filter)
      .populate("homeTeam", "name city")
      .populate("awayTeam", "name city")
      .sort({ date: -1 });
    res.json(games);
  } catch (err) {
    next(err);
  }
};

// GET /api/games/:id
export const getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate("homeTeam", "name city")
      .populate("awayTeam", "name city");

    if (!game) {
      res.status(404);
      throw new Error("Game not found");
    }

    res.json(game);
  } catch (err) {
    next(err);
  }
};

// POST /api/games
export const createGame = async (req, res, next) => {
  try {
    const { homeTeam, awayTeam, date, location } = req.body;

    if (homeTeam === awayTeam) {
      res.status(400);
      throw new Error("Home team and away team cannot be the same");
    }

    const game = await Game.create({ homeTeam, awayTeam, date, location });
    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
};

// PUT /api/games/:id
export const updateGameStatus = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404);
      throw new Error("Game not found");
    }

    const { status } = req.body;
    game.status = status ?? game.status;
    const updated = await game.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PUT /api/games/:id/sets
export const updateSets = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404);
      throw new Error("Game not found");
    }

    if (game.status === "completed") {
      res.status(400);
      throw new Error("Cannot update sets on a completed game");
    }

    const { sets } = req.body;
    game.sets = sets;
    const updated = await game.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/games/:id
export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404);
      throw new Error("Game not found");
    }

    await game.deleteOne();
    res.json({ message: "Game removed" });
  } catch (err) {
    next(err);
  }
};
