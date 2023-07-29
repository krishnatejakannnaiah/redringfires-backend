const express = require("express");
const router = express.Router();

const {registerUser, loginUser, currentUser, getAllUsers, deleteUser, editUser, getUser} = require('../controllers/userController');
const validateToken = require("../middleware/validateTokenHandler");

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/current", validateToken, currentUser);

router.get("/user/:id", validateToken, getUser);

router.get("/allusers", getAllUsers);

router.put("/edituser/:id", validateToken, editUser)

router.delete("/deleteuser/:id", validateToken, deleteUser);

module.exports = router;