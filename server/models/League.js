import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "League name is required"],
      trim: true,
    },
    country: {
      type: String,
      requried: [true, "Country is required"],
      trim: true,
      default: "GR",
    },
    gender: {
      type: String,
      enum: ["men", "women"],
      required: [true, "Gender is required"],
    },
    // pyramid position: 1 = top tier, 2 = second tier ...
    tier: {
      type: Number,
      required: [true, "Tier is required"],
      min: 1,
    },
    // for differentiation on lower tier leagues e.g. A2 South Group / A2 North Group
    group: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

leagueSchema.index(
  { name: 1, country: 1, gender: 1, tier: 1, group: 1 },
  { unique: true },
);

export default mongoose.model("League", leagueSchema);
