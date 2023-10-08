import IDevice from "@/types/IDevice";
import mongoose, { Schema } from "mongoose";

const deviceSchema = new Schema<IDevice>(
  {
    sn: {
      type: Number,
      required: true,
    },
    csm: {
      type: Number,
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
    use: {
      type: Number,
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

const Device =
  mongoose.models.Device || mongoose.model<IDevice>("Device", deviceSchema);

export default Device;
