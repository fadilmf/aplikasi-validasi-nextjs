import mongoose, { Schema } from "mongoose";

const deviceSchema = new Schema(
  {
    sn: {
      type: String,
      required: true,
      unique: true,
    },
    merk: {
      type: String,
      required: true,
    },
    csm: {
      type: String,
      required: true,
    },
    perangkat: {
      type: String,
      required: true,
    },
    jenis: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    regional: {
      type: Number,
      required: true,
    },
    witel: {
      type: String,
      required: true,
    },
    use: {
      type: String,
      required: true,
    },
    nik: {
      type: Number,
      required: true,
    },
    telp: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    validAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema);

export default Device;
