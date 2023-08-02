const express = require("express");
const router = express.Router();

const { getAllPosts, getPosts, getPost, createPost, editPost, deletePost, deleteAllPost, getUserPosts, getCategoryPosts } = require("../controllers/postController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/allposts", getAllPosts);

router.get("/getcurrentposts", validateToken, getPosts)

router.get("/getpost/:id", validateToken, getPost);

router.post("/createpost", validateToken, createPost);

router.put("/editpost/:id", validateToken, editPost);

router.delete("/deletepost/:id", validateToken, deletePost);

router.delete("/deleteallposts", validateToken, deleteAllPost)

router.get("/user/:id", validateToken, getUserPosts)

router.get("/category/:id", validateToken, getCategoryPosts)



module.exports = router;