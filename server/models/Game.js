import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    setNumber: {
      type: Number,
      required: true,
    },
    homePoints: {
      type: Number,
      required: true,
      default: 0,
    },
    awayPoints: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const gameSchema = new mongoose.Schema(
  {
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Home team is required"],
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Away team is required"],
    },
    date: {
      type: Date,
      required: [true, "Game date is required"],
    },
    location: {
      type: String,
      trim: true,
    },
    sets: [setSchema],
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

// compute set won by each team
gameSchema.virtual("score").get(function () {
  const homeSetsWon = this.sets.filter(
    (s) => s.homePoints > s.awayPoints,
  ).length;
  const awaySetsWon = this.sets.filter(
    (s) => s.awayPoints > s.homePoints,
  ).length;
  return { home: homeSetsWon, away: awaySetsWon };
});

// find winner from sets won
gameSchema.virtual("winner").get(function () {
  const { home, away } = this.score;
  if (this.status !== "completed") return null;
  if (home > away) return this.homeTeam;
  if (away > home) return this.awayTeam;
  return null;
});

gameSchema.set("toJSON", { virtuals: true });
gameSchema.set("toObject", { virtuals: true });

export default mongoose.model("Game", gameSchema);
