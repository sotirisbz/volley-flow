import mongoose from "mongoose";

const gameStatsSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "Game reference is required"],
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "Player reference is required"],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team reference is required"],
    },

    // Attacking
    kills: {
      type: Number,
      default: 0,
    },
    attackAttempts: {
      type: Number,
      default: 0,
    },
    attackErrors: {
      type: Number,
      default: 0,
    },

    // Serving
    aces: {
      type: Number,
      default: 0,
    },
    serveAttempts: {
      type: Number,
      default: 0,
    },
    serverErrors: {
      type: Number,
      default: 0,
    },

    // Defence
    digs: {
      type: Number,
      default: 0,
    },
    receptionErrors: {
      type: Number,
      default: 0,
    },

    //Blocking
    blocks: {
      type: Number,
      default: 0,
    },
    blockErrors: {
      type: Number,
      default: 0,
    },

    // Setting
    assists: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

gameStatsSchema.index({ game: 1, player: 1 }, { unique: true });

gameStatsSchema.virtual("attackPct").get(function () {
  if (!this.attackAttempts) return 0;
  return ((this.kills - this.attackErrors) / this.attackAttempts).toFixed(3);
});

gameStatsSchema.set("toJSON", { virtuals: true });
gameStatsSchema.set("toObject", { virtuals: true });

export default mongoose.model("Gamestats", gameStatsSchema);
