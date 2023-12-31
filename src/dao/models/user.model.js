import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true, 
  },
  age: Number,
  password: String,
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: Date, 
});

const userModel = model("user", userSchema);

export { userModel };
