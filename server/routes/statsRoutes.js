import express from "express";
import {
  getStatsByGame,
  getStatsByPlayer,
  getPlayerSeasonStats,
  createStats,
  updateStats,
  deleteStats,
} from "../controllers/gameStatsController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createStats);
router.route("/:id").put(protect, updateStats).delete(protect, deleteStats);
router.route("/game/:gameId").get(getStatsByGame);
router.route("/player/:playerId").get(getStatsByPlayer);
router.route("/player/:playerId/season").get(getPlayerSeasonStats);

export default router;
