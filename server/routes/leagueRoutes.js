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

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getLeagues).post(protect, createLeague);
router
  .route("/:id")
  .get(getLeagueById)
  .put(protect, updateLeague)
  .delete(protect, deleteLeague);
router.route("/:id/teams").get(getLeagueTeams);
router.route("/:id/standings").get(getLeagueStandings);

export default router;
