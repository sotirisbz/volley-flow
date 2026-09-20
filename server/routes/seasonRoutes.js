import express from "express";
import {
  getSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
} from "../controllers/seasonController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getSeasons).post(protect, createSeason);
router
  .route("/:id")
  .get(getSeasonById)
  .put(protect, updateSeason)
  .delete(protect, deleteSeason);

export default router;
