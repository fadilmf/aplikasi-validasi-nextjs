import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema({
  expiration_days: {
    type: Number,
    required: true,
    default: 30,
  },
});

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
