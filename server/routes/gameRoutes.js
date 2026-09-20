import express from "express";
import {
  getGames,
  getGameById,
  createGame,
  updateGameStatus,
  updateSets,
  deleteGame,
} from "../controllers/gameController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getGames).post(protect, createGame);
router.route("/:id").get(getGameById).delete(protect, deleteGame);
router.route("/:id/status").put(protect, updateGameStatus);
router.route("/:id/sets").put(protect, updateSets);

export default router;
