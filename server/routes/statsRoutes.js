import express from "express";
import {
  getStatsByGame,
  getStatsByPlayer,
  getPlayerSeasonStats,
  createStats,
  updateStats,
  deleteStats,
} from "../controllers/gameStatsController.js";

const router = express.Router();

router.route("/").post(createStats);
router.route("/:id").put(updateStats).delete(deleteStats);
router.route("/game/:gameId").get(getStatsByGame);
router.route("/player/:playerId").get(getStatsByPlayer);
router.route("/player/:playerId/season").get(getPlayerSeasonStats);

export default router;
