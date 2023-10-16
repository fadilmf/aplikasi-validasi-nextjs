import { Schema } from "mongoose";

interface User {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  regional: number;
  role: string;
}

export default User;
