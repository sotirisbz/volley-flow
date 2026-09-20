import express from "express";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getTeams).post(protect, createTeam);
router
  .route("/:id")
  .get(getTeamById)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

export default router;
