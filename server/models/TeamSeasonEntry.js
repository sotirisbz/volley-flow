import mongoose from "mongoose";

const teamSeasonEntrySchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: [true, "League is required"],
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: [true, "Season is required"],
    },
  },
  { timestamps: true },
);

teamSeasonEntrySchema.index({ team: 1, season: 1 }, { unique: true });

export default mongoose.model("TeamSeasonEntry", teamSeasonEntrySchema);
