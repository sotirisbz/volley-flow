import expres from "express";
import {
  assignTeamToLeague,
  getTeamSeasonHistory,
  removeTeamSeasonEntry,
} from "../controllers/teamSeasonController.js";

import { protect } from "../middleware/auth.js";

const router = expres.Router();

router.route("/").post(protect, assignTeamToLeague);
router.route("/team/:teamId").get(getTeamSeasonHistory);
router.route("/:id").delete(protect, removeTeamSeasonEntry);

export default router;
