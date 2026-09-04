import express from "express";
import {
  getLeagues,
  getLeagueById,
  createLeague,
  updateLeague,
  deleteLeague,
  getLeagueTeams,
  getLeagueStandings,
} from "../controllers/leagueController.js";

const router = express.Router();

router.route("/").get(getLeagues).post(createLeague);
router.route("/:id").get(getLeagueById).put(updateLeague).delete(deleteLeague);
router.route("/:id/teams").get(getLeagueTeams);
router.route("/:id/standings").get(getLeagueStandings);

export default router;
