import express from "express";
import {
  getSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
} from "../controllers/seasonController.js";

const router = express.Router();

router.route("/").get(getSeasons).post(createSeason);
router.route("/:id").get(getSeasonById).put(updateSeason).delete(deleteSeason);

export default router;
