import express from "express";
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getPlayers).post(protect, createPlayer);
router
  .route("/:id")
  .get(getPlayerById)
  .put(protect, updatePlayer)
  .delete(protect, deletePlayer);

export default router;
