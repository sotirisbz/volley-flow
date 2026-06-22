import express from "express";
import {
  getStatsByGame,
  getStatsByPlayer,
  createStats,
  updateStats,
  deleteStats,
} from "../controllers/gameStatsController.js";

const router = express.Router();

router.route("/").post(createStats);
router.route("/:id").put(updateStats).delete(deleteStats);
router.route("/game/:gameId").get(getStatsByGame);
router.route("/player/:playerId").get(getStatsByPlayer);

export default router;
