const asyncHandler = require('express-async-handler');
const clapSchema = require("../models/claps");

const getAllClaps = asyncHandler(async (req, res) => {
    console.log("hello");

    const allClaps = await clapSchema.find();
    res.status(200).json(allClaps);
})


// const getClaps = asyncHandler(async (req, res) => {
//     const posts = await postSchema.find({user_id: req.user.id});

// })


const createClap = asyncHandler(async (req, res) => {
    console.log('triggered')
    const { post_id, email, username,} = req.body;
    if (!post_id || !email || !username) {
        res.status(400).json("All fields are required");
        throw new Error("All fields are required");
    }
    const Clap = await clapSchema.create({
        post_id, email, username, user_id: req.user.id,
    })
    res.status(201).json(Clap);
})


module.exports = { createClap,  getAllClaps};