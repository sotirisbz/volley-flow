import express from "express";
import {
  getGames,
  getGameById,
  createGame,
  updateGameStatus,
  updateSets,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.route("/").get(getGames).post(createGame);
router.route("/:id").get(getGameById).delete(deleteGame);
router.route("/:id/status").put(updateGameStatus);
router.route("/:id/sets").put(updateSets);

export default router;
