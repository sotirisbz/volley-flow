import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Season name is required"],
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: [true, "Season start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Season end date is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Season", seasonSchema);
