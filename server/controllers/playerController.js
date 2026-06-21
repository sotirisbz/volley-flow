import Player from "../models/Player.js";

// GET /api/players
export const getPlayers = async (req, res, next) => {
  try {
    const filter = req.query.team ? { team: req.query.team } : {};
    const players = await Player.find(filter)
      .populate("team", "name city")
      .sort({ name: 1 });
    res.json(players);
  } catch (err) {
    next(err);
  }
};

// GET /api/players/:id
export const getPlayerById = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate(
      "team",
      "name city",
    );
    if (!player) {
      res.status(404);
      throw new Error("Player not found");
    }
    res.json(player);
  } catch (err) {
    next(err);
  }
};

// POST /api/players
export const createPlayer = async (req, res, next) => {
  try {
    const { name, number, position, team } = req.body;
    const player = await Player.create({ name, number, position, team });
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
};

// PUT /api/players/:id
export const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      res.status(404);
      throw new Error("Player not found");
    }
    const { name, number, position, team } = req.body;
    player.name = name ?? player.name;
    player.number = number ?? player.number;
    player.position = position ?? player.position;
    player.team = team ?? player.team;
    const updated = await player.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/players/:id
export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      res.status(404);
      throw new Error("Player not found");
    }
    await player.deleteOne();
    res.json({ message: "Player removed" });
  } catch (err) {
    next(err);
  }
};
