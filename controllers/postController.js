const asyncHandler = require('express-async-handler');

const postSchema = require("../models/postModal");
const usersSchema = require("../models/userModel")
const { Mongoose } = require('mongoose');

const getAllPosts = asyncHandler(async (req, res) => {
    const allPosts = await postSchema.find().populate("user_id", "username");
    res.status(200).json(allPosts);
})


const getPosts = asyncHandler(async (req, res) => {
    const posts = await postSchema.find({user_id: req.user.id}).populate("user_id", "username");
    res.status(200).json(posts);
});


const getPost = asyncHandler(async (req, res) => {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("post not found!");
    }
    else {
        res.status(200).json(post)
    }
});

const createPost = asyncHandler(async (req, res) => {
    const { post, post_description, category, media_link, media_type} = req.body;
    if (!post || !category) {
        res.status(400).json("All fields are required");
        throw new Error("All fields are required");
    }
    const Post = await postSchema.create({
        post, post_description, category, media_link, media_type, user_id: req.user.id, email: req.user.email, username: req.user.username
    })
    res.status(201).json(Post);
})


const editPost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await postSchema.findById(id).exec();;
    if (!post) {
        res.status(404);
        throw new Error("post not found!");
    }

    if (post._id.toString() !== req.params.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }

    const updatedPost = await postSchema.findOneAndUpdate(
        {_id: id},
        req.body,
        {new: true}
    );
    res.status(200).json({data: `post updated ${req.params.id}`, post: updatedPost})
})


const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Note ID found' })
    }
    const post = await postSchema.findById(id).exec();

    if (!post) {
        res.status(404);
        throw new Error("Post not found!");
    }


    const result = await post.deleteOne()
    const reply = `Post with ID ${result._id} deleted`

    res.json(reply)

    // if (!post.id.includes(req.params.id)) {
    //     res.status(403).json({message: "User dont have the permission"});
    //     throw new Error("User dont have the permission");
    // }

    const deletingPost = await post.findByIdAndDelete(
        Mongoose.Types.ObjectId(post._id)
    )
    res.status(200).json({data: `deleted post ${req.params.id}`})
});


const deleteAllPost = asyncHandler(async (req, res) => {
    try {
        // Delete all posts
        const result = await postSchema.deleteMany();
    
        return res.json({ message: 'All posts deleted successfully', deletedCount: result.deletedCount });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to delete posts' });
      }
})



module.exports = { getAllPosts, getPosts, getPost, createPost, editPost, deletePost, deleteAllPost }