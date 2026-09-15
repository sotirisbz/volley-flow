import express from "express";
import {
  assignPlayerToTeam,
  getPlayerSeasonHistory,
  getTeamSeasonRoster,
  removePlayerSeasonEntry,
} from "../controllers/playerSeasonController.js";

const router = express.Router();

router.route("/").post(assignPlayerToTeam);
router.route("/player/:playerId").get(getPlayerSeasonHistory);
router.route("/team/:teamId").get(getTeamSeasonRoster);
router.route("/:id").delete(removePlayerSeasonEntry);

export default router;
