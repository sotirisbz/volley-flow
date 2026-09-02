import Season from "../models/Season.js";

// GET /api/seasons
export const getSeasons = async (req, res, next) => {
  try {
    const seasons = await Season.find().sort({ startDate: -1 });
    res.json(seasons);
  } catch (err) {
    next(err);
  }
};

// GET /api/seasons/:id
export const getSeasonById = async (req, res, next) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) {
      res.status(404);
      throw new Error("Season not found");
    }
    res.json(season);
  } catch (err) {
    next(err);
  }
};

// POST /api/seasons
export const createSeason = async (req, res, next) => {
  try {
    const { name, startDate, endDate } = req.body;
    const season = await Season.create({ name, startDate, endDate });
    res.status(201).json(season);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("A season with this name already exists"));
    }
    next(err);
  }
};

// PUT /api/seasons:id
export const updateSeason = async (req, res, next) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) {
      res.status(404);
      throw new Error("Season not found");
    }

    const { name, startDate, endDate } = req.body;
    season.name = name ?? season.name;
    season.startDate = startDate ?? season.startDate;
    season.endDate = endDate ?? season.endDate;

    const updated = await season.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/seasons:id
export const deleteSeason = async (req, res, next) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) {
      res.status(404);
      throw new Error("Season not found");
    }
    await season.deleteOne();
    res.json({ message: "Season removed" });
  } catch (err) {
    next(err);
  }
};
