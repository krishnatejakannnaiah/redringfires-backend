const asyncHandler = require('express-async-handler');
const clapSchema = require("../models/LikeSchema");
const postSchema = require("../models/postModal");
const usersSchema = require("../models/userModel");

const createClap = asyncHandler(async (req, res) => {
    try {
    const { id } = req.params;
    const { user_id } = req.body;
    const like = new clapSchema();
    await like.save();

    const User = await usersSchema.findById(user_id).exec();

    console.log(like);

    const post = await postSchema.findByIdAndUpdate(
        id,
        { $push: { claps: like, user: user_id, userData: User } },
        { new: true }
      ).populate('claps');
  
      res.status(200).json(post);
    }
    catch {
        res.status(500).json({ error: error.message });
    }
    

})







module.exports = { createClap }