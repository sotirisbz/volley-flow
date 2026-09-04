import Game from "../models/Game.js";
import TeamSeasonEntry from "../models/TeamSeasonEntry.js";

// GET /api/games
export const getGames = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.league) filter.league = req.query.league;
    if (req.query.season) filter.season = req.query.season;
    if (req.query.team) {
      filter.$or = [{ homeTeam: req.query.team }, { awayTeam: req.query.team }];
    }

    const games = await Game.find(filter)
      .populate("homeTeam", "name city")
      .populate("awayTeam", "name city")
      .populate("league", "name country gender tier group")
      .populate("season", "name startDate endDate")
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
      .populate("awayTeam", "name city")
      .populate("league", "name country gender tier group")
      .populate("season", "name startDate endDate");

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
    const { league, season, homeTeam, awayTeam, date, location } = req.body;

    if (homeTeam === awayTeam) {
      res.status(400);
      throw new Error("Home team and away team cannot be the same");
    }

    const [homeEntry, awayEntry] = await Promise.all([
      TeamSeasonEntry.findOne({ team: homeTeam, league, season }),
      TeamSeasonEntry.findOne({ team: awayTeam, league, season }),
    ]);

    if (!homeEntry || !awayEntry) {
      res.status(400);
      throw new Error(
        "Both teams must be register in this league for this season before a game can be created",
      );
    }

    const game = await Game.create({
      league,
      season,
      homeTeam,
      awayTeam,
      date,
      location,
    });
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
