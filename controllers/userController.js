const asyncHandler = require('express-async-handler');
const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req,res) => {
    const {username, email, password, profile_picture} = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable  = await user.findOne({email});
    if (userAvailable) {
        res.status(400).json({message: "user already registered!"});
        throw new Error("user already registered!");
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await user.create({
        username, email, password: hashedPassword, profile_picture
    })
    if (User) {
        res.status(200).json({id: User.id, email: User.email, username: User.username, profile_picture: User.profile_picture})
    }
    else {
        res.status(400);
        throw new Error("userdata is not valid!");
    }
    res.json({message: 'user registered!'})
});


const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({message: "All fields are mandatory!"})
        throw new Error("All fields are mandatory");
    }
    const User = await user.findOne({ email });
    // compare pass with the hashed
    if (User && (await bcrypt.compare(password, User.password))) {
        const accessToken = jwt.sign({
            user: {
                username: User.username,
                email: User.email,
                id: User._id 
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "2880m"}    
    )

    res.status(200).json({accessToken})

    } else {
        res.status(401).json({message: "email or password is not valid"});
        throw new Error("email or password is not valid")
    }

});


//private
const currentUser = asyncHandler(async (req,res) => {
    // console.log(req.user);
    // res.json(req.user);
    const User = await user.findById(req.user.id);
    if (!User) {
        res.status(404);
        throw new Error("User not found!");
    }
    else {
        res.status(200).json(User)
    }
});


const getUser = asyncHandler(async (req,res) => {
    const User = await user.findById(req.params.id);
    if (!User) {
        res.status(404);
        throw new Error("User not found!");
    }
    else {
        res.status(200).json(User)
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await user.find();
    res.status(200).json(allUsers);
})


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'No ID found' })
    }

    const User = await user.findById(id).exec();
    if (!User) {
        res.status(404);
        throw new Error("User not found!");
    }
    if (User.id.toString() !== req.params.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }

    const result = await User.deleteOne()
    const reply = `Post with ID ${result._id} deleted`
    res.json(reply)

    const deletingUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({data: `deleted user ${req.params.id}`, user: deletingUser})
})

const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const User = await user.findById(id).exec();
    if (!User) {
        res.status(404);
        throw new Error("user not found!");
    }

    if (User.id.toString() !== req.params.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }
    const updatedUser = await user.findOneAndUpdate(
        {_id: id},
        req.body,
        {new: true}
    );

    console.log(User);
    res.status(200).json({data: `User updated ${req.params.id}`, user: updatedUser})


})

module.exports = { registerUser, loginUser, currentUser, getAllUsers, deleteUser, editUser, getUser };