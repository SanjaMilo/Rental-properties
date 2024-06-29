import { Schema, model, models } from "mongoose";

//* Use Google account authentication

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model("User", UserSchema);

export default UserModel;

// const UserModel = mongoose.model('user', UserSchema);
// export default UserModel;
