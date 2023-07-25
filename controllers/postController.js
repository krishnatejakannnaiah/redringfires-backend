const asyncHandler = require('express-async-handler');

const postSchema = require("../models/postModal");

const getAllPosts = asyncHandler(async (req, res) => {
    const allPosts = await postSchema.find();
    res.status(200).json(allPosts);
})


const getPosts = asyncHandler(async (req, res) => {
    const posts = await postSchema.find({user_id: req.user.id});
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
    const post = await postSchema.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("post not found!");
    }

    if (post.user_id.toString() !== req.user.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }

    const updatedPost = await post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json({data: `post updated ${req.params.id}`, post: updatedPost})
})

const deletePost = asyncHandler(async (req, res) => {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found!");
    }

    if (post.user_id.toString() !== req.user.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }
    

    const deletingPost = await post.findByIdAndDelete(
        req.params.id,
    )
    res.status(200).json({data: `deleted post ${req.params.id}`})
});


module.exports = { getAllPosts, getPosts, getPost, createPost, editPost, deletePost }