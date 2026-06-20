import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requirede: [true, "Player name is required"],
      trim: true,
    },
    number: {
      type: Number,
      required: [true, "Jersey number is required"],
    },
    position: {
      type: String,
      enum: [
        "Setter",
        "Outside Hitter",
        "Opposite",
        "Middle Blocker",
        "Libero",
        "Defensive Spesialist",
      ],
      required: [true, "Position is required"],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Player", playerSchema);
