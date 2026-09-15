import mongoose, { mongo } from "mongoose";

const playerSeasonEntrySchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "Player is required"],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: [true, "Season is required"],
    },
  },
  { timestamps: true },
);

playerSeasonEntrySchema.index({ player: 1, season: 1 }, { unique: true });

export default mongoose.model("PlayerSeasonEntry", playerSeasonEntrySchema);
