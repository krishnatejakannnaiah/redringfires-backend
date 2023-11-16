const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postSchema = require("../models/postModal");
const usersSchema = require("../models/userModel");
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, profile_picture, verified, bio, gender } =
    req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await user.findOne({ email });
  if (userAvailable) {
    res.status(400).json({ message: "user already registered!" });
    throw new Error("user already registered!");
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  const User = await user.create({
    username,
    email,
    password: hashedPassword,
    profile_picture,
    verified,
    bio,
    gender,
  });
  if (User) {
    res.status(200).json({
      id: User.id,
      email: User.email,
      username: User.username,
      profile_picture: User.profile_picture,
      verified: User.verified,
      bio: User.bio,
      gender: User.gender,
    });
  } else {
    res.status(400);
    throw new Error("userdata is not valid!");
  }
  res.json({ message: "user registered!" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are mandatory!" });
    throw new Error("All fields are mandatory");
  }
  const User = await user.findOne({ email });
  // compare pass with the hashed
  if (User && (await bcrypt.compare(password, User.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: User.username,
          email: User.email,
          id: User._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2880m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "email or password is not valid" });
    throw new Error("email or password is not valid");
  }
});

//private
const currentUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  // res.json(req.user);
  const User = await user.findById(req.user.id);
  if (!User) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    res.status(200).json(User);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const User = await user.findById(req.params.id);
  if (!User) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    res.status(200).json(User);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await user.find();
  res.status(200).json(allUsers);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "No ID found" });
  }

  const User = await user.findById(id).exec();
  if (!User) {
    res.status(404);
    throw new Error("User not found!");
  }
  if (User.id.toString() !== req.params.id) {
    res.status(403).json({ message: "User dont have the permission" });
    throw new Error("User dont have the permission");
  }

  try {
    const deletionResult = await postSchema.deleteMany({
      user_id: req.params.id,
    });
    console.log(deletionResult.deletedCount);
    const result1 = await User.deleteOne();
    const reply = `Post with ID ${result1._id} deleted`;
    res.json(reply);
    const deletingUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: `deleted user ${req.params.id}`,
      user: deletingUser,
      deletedCount: deletionResult.deletedCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const User = await user.findById(id).exec();
  console.log(User);

  if (!User) {
    res.status(404);
    throw new Error("user not found!");
  }

  if (User.id.toString() !== req.params.id) {
    res.status(403).json({ message: "User dont have the permission" });
    throw new Error("User dont have the permission");
  }
  const updatedUser = await user.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  console.log(User);
  res
    .status(200)
    .json({ data: `User updated ${req.params.id}`, user: updatedUser });
});

const connectUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const userData = await user.findById(id);
    const { userId } = req.body;
    const connectedUser = await user.findById(userId).exec();

    if (!id || !connectedUser) {
      res.status(404);
      throw new Error("user not found!");
    }
    userData.following.push(connectedUser._id);
    connectedUser.followers.push(connectedUser._id)
    await userData.save();
    return res
      .status(200)
      .json({ message: "Connected successfully", userData });
  } catch (error) {
    return res.status(500).json({ message: "Error connecting users" });
  }
});

const disConnect = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.body;

    console.log(id, req.body.userId);

    const User = await user.findById(id).exec();
    const disconnectedUser = await user.findById(userId).exec();

    if (!User || !disconnectedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    User.following = User.following.filter(
      (connection) => !connection.equals(disconnectedUser._id)
    );
    disconnectedUser.followers = disconnectedUser.followers.filter(
        (connection) => !connection.equals(disconnectedUser._id)
    );

    await User.save();

    return res.status(200).json({ message: "Disconnected successfully", User });
  } catch (error) {
    return res.status(500).json({ message: "Error disconnecting users" });
  }

});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getAllUsers,
  deleteUser,
  editUser,
  getUser,
  connectUser,
  disConnect,
};
