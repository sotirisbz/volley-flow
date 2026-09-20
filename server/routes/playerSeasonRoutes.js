import express from "express";
import {
  assignPlayerToTeam,
  getPlayerSeasonHistory,
  getTeamSeasonRoster,
  removePlayerSeasonEntry,
} from "../controllers/playerSeasonController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, assignPlayerToTeam);
router.route("/player/:playerId").get(getPlayerSeasonHistory);
router.route("/team/:teamId").get(getTeamSeasonRoster);
router.route("/:id").delete(protect, removePlayerSeasonEntry);

export default router;
