const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the username"],
    },
    email: {
      type: String,
      required: [true, "Please add the useremail"],
      unique: [true, "Email address already taken!"],
    },
    password: {
      type: String,
      required: [true, "Please add the userpassword"],
    },
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    profile_picture: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", usersSchema);
