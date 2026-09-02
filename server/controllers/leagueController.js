import League from "../models/League.js";
import TeamSeasonEntry from "../models/TeamSeasonEntry.js";
import Game from "../models/Game.js";

// GET /api/leagues?country=&gender=&tier=
export const getLeagues = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.tier) filter.tier = Number(req.query.tier);

    const leagues = await League.find(filter).sort({
      country: 1,
      gender: 1,
      tier: 1,
      group: 1,
    });
    res.json(leagues);
  } catch (err) {
    next(err);
  }
};

// GET /api/leagues/:id
export const getLeagueById = async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      res.status(404);
      throw new Error("League not found");
    }
    res.json(league);
  } catch (err) {
    next(err);
  }
};

// POST /api/leagues
export const createLeague = async (req, res, next) => {
  try {
    const { name, country, gender, tier, group } = req.body;
    const league = await League.create({ name, country, gender, tier, group });
    res.status(201).json(league);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("A league with this identity already exists"));
    }
    next(err);
  }
};

// PUT /api/leagues/:id
export const updateLeague = async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      res.status(404);
      throw new Error("League not found");
    }

    const { name, country, gender, tier, group } = req.body;
    league.name = name ?? league.name;
    league.country = country ?? league.country;
    league.gender = gender ?? league.gender;
    league.tier = tier ?? league.tier;
    if (group != undefined) league.group = group;

    const updated = await league.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leagues/:id
export const deleteLeague = async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      res.status(404);
      throw new Error("League not found");
    }
    await league.deleteOne();
    res.json({ message: "League removed" });
  } catch (err) {
    next(err);
  }
};

// GET /api/leagues/:id/teams?season=<seasonId>
export const getLeagueTeams = async (req, res, next) => {
  try {
    const { season } = req.query;
    if (!season) {
      res.status(404);
      throw new Error("A season query parameter is required");
    }

    const entries = await TeamSeasonEntry.find({
      league: req.params.id,
      season,
    }).populate("team", "name city");

    res.json(entries.map((entry) => entry.team));
  } catch (err) {
    next(err);
  }
};

const winPoints = (setsWon, setsLost) => {
  if (setsWon === 3 && setsLost <= 1) return 3;
  if (setsWon === 3 && setsLost === 2) return 2;
  return 0;
};

const lossPoints = (setsWon, setsLost) =>
  setsLost === 3 && setsWon === 2 ? 1 : 0;

// GET /api/league/:id/standings?season<seasonId>
// standings are computed and not stored as data
export const getLeagueStandings = async (req, res, next) => {
  try {
    const { season } = req.query;
    if (!season) {
      res.status(400);
      throw new Error("A season query parameter is required");
    }

    const [entries, games] = await Promise.all([
      TeamSeasonEntry.find({ league: req.params.id, season }).populate(
        "team",
        "name city",
      ),
      Game.find({ league: req.params.id, season, status: "completed" }),
    ]);

    const table = new Map();
    entries.forEach(({ team }) => {
      table.set(String(team._id), {
        team,
        played: 0,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        leaguePoints: 0,
      });
    });
    games.forEach((game) => {
      const home = table.get(String(game.homeTeam));
      const away = table.get(String(game.awayTeam));

      if (!home || !away) return;

      const homeSets = game.sets.filter(
        (s) => s.homePoints > s.awayPoints,
      ).length;
      const awaySets = game.sets.filter(
        (s) => s.awayPoints > s.homePoints,
      ).length;
      const homeRally = game.sets.reduce((sum, s) => sum + s.homePoints, 0);
      const awayRally = game.sets.reduce((sum, s) => sum + s.awayPoints, 0);

      home.played += 1;
      away.played += 1;
      home.setsWon += homeSets;
      home.setsLost += awaySets;
      away.setsWon += awaySets;
      away.setsLost += homeSets;
      home.pointsFor += homeRally;
      home.pointsAgainst += awayRally;
      away.pointsFor += awayRally;
      away.pointsAgainst += homeRally;

      if (homeSets > awaySets) {
        home.wins += 1;
        away.losses += 1;
        home.leaguePoints += winPoints(homeSets, awaySets);
        away.leaguePoints += lossPoints(homeSets, awaySets);
      } else {
        away.wins += 1;
        home.losses += 1;
        away.leaguePoints += winPoints(awaySets, homeSets);
        home.leaguePoints += lossPoints(awaySets, homeSets);
      }
    });

    const standings = Array.from(table.values()).sort((a, b) => {
      if (b.leaguePoints !== a.leaguePoints)
        return b.leaguePoints - a.leaguePoints;

      const aSetRatio = a.setsLost ? a.setsWon / a.setsLost : a.setsWon;
      const bSetRatio = b.setsLost ? b.setsWon / b.setsLost : b.setsWon;
      if (bSetRatio !== aSetRatio) return bSetRatio - aSetRatio;

      const aPointsRatio = a.pointsAgainst
        ? a.pointsFor / a.pointsAgainst
        : a.pointsFor;
      const bPointsRatio = b.pointsAgainst
        ? b.pointsFor / b.pointsAgainst
        : b.pointsFor;
      return bPointsRatio - aPointsRatio;
    });

    res.json(standings);
  } catch (err) {
    next(err);
  }
};
