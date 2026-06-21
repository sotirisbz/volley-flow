import express from "express";
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

const router = express.Router();

router.route("/").get(getPlayers).post(createPlayer);
router.route("/:id").get(getPlayerById).put(updatePlayer).delete(deletePlayer);

export default router;
