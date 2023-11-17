import mongoose, { Schema } from "mongoose";

const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    device_sn: {
      type: String,
      required: true,
    },
    images: [
      {
        type: Buffer,
      },
    ],
    notes: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const History =
  mongoose.models.History || mongoose.model("History", historySchema);

export default History;
