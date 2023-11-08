import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true,unique:true },
    hash: { type: String, require: true },
    pic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NMEa-JLyykEpAHDobica15GN5Ge8GISAQ&usqp=CAU",
    },
  },
  {
    // generate a timestamep every time a new  User is added/created
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
