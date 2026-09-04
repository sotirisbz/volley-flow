import expres from "express";
import {
  assignTeamToLeague,
  getTeamSeasonHistory,
  removeTeamSeasonEntry,
} from "../controllers/teamSeasonController.js";

const router = expres.Router();

router.route("/").post(assignTeamToLeague);
router.route("/team/:teamId").get(getTeamSeasonHistory);
router.route("/:id").delete(removeTeamSeasonEntry);

export default router;
