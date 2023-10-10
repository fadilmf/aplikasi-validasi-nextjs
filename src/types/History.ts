import { Schema } from "mongoose";

interface History {
  _id: Schema.Types.ObjectId;
  user: { username: string };
  device_sn: number;
  images: string[];
  notes: string;
  location: string;
  createdAt: Date;
}

export default History;
